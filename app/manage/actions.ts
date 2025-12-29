// app/manage/actions.ts
'use server'
import prisma from "@/lib/prisma"

export async function fetchAndSaveFixtures(gw: number) {
  try {
    const response = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`)
    const data = await response.json()

    const promises = data.map((item: any) => {
      // ดึงข้อมูล stats ตามลำดับที่ FPL กำหนด (0: Goals, 1: Assists)
      const goalsData = item.stats && item.stats.length > 0 ? item.stats[0] : null
      const assistsData = item.stats && item.stats.length > 1 ? item.stats[1] : null

      return prisma.fixture.upsert({
        where: { id: item.code },
        update: {
          gw: item.event,
          kickoff: new Date(item.kickoff_time),
          home: String(item.team_h),
          away: String(item.team_a),
          homeScore: item.team_h_score,
          awayScore: item.team_a_score,
          finished: item.finished,
          goalsScored: goalsData,
          assists: assistsData,
        },
        create: {
          id: item.code,
          gw: item.event,
          kickoff: new Date(item.kickoff_time),
          home: String(item.team_h),
          away: String(item.team_a),
          homeScore: item.team_h_score,
          awayScore: item.team_a_score,
          finished: item.finished,
          multiplier: 1,
          goalsScored: goalsData,
          assists: assistsData,
        },
      })
    })

    await Promise.all(promises)

    // 2. ตรวจสอบว่าใน Gameweek นี้แข่งจบครบทุกนัดหรือยัง
    const allFinished = data.every((item: any) => item.finished === true)

    if (allFinished && data.length > 0) {
      await prisma.gameweek.update({
        where: { gw: gw },
        data: { isFinished: true }
      })
      return { 
        success: true, 
        message: `Updated GW ${gw} and marked Gameweek as FINISHED!` 
      }
    }
    
    return { success: true, message: `Updated GW ${gw} with stats successfully!` }
  } catch (error) {
    return { success: false, message: "Error updating fixtures" }
  }
}

export async function syncGameweekStatus() {
  try {
    const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await res.json();

    // หา Gameweek ถัดไป (is_next: true) ตาม Logic ในภาพของคุณ
    const nextGwData = data.events.find((ev: any) => ev.is_next === true);

    if (nextGwData) {
      await prisma.gameweek.upsert({
        where: { gw: nextGwData.id },
        update: {
          gwDeadline: new Date(nextGwData.deadline_time),
        },
        create: {
          gw: nextGwData.id,
          gwDeadline: new Date(nextGwData.deadline_time),
          calculated: false,
        },
      });
      return { success: true, gw: nextGwData.id, deadline: nextGwData.deadline_time };
    }
  } catch (error) {
    console.error("Sync GW Error:", error);
    return { success: false };
  }
}

export async function calculatePoints(gw: number) {
  try {
    // 1. ดึงข้อมูล Fixtures ทั้งหมดใน GW นั้นที่แข่งจบแล้ว
    const fixtures = await prisma.fixture.findMany({
      where: { gw, finished: true }
    });

    if (fixtures.length === 0) {
      return { success: false, message: "No finished fixtures found for this GW." };
    }

    // 2. ดึงข้อมูลการทายผลทั้งหมดของ GW นี้
    const predictions = await prisma.prediction.findMany({
      where: { gw }
    });

    const updatePromises = predictions.map((pred) => {
      const actual = fixtures.find(f => f.id === pred.fixtureId);
      if (!actual) return null;

      let points = 0;

      // คำนวณหาผู้ชนะ (Win/Draw/Loss)
      const actualResult = actual.homeScore! > actual.awayScore! ? 'H' : actual.homeScore! < actual.awayScore! ? 'A' : 'D';
      const predResult = pred.predHome > pred.predAway ? 'H' : pred.predHome < pred.predAway ? 'A' : 'D';

      // เช็คทายถูก (Correct Result)
      if (actualResult === predResult) {
        points = actual.correctWinPoint * actual.multiplier * pred.multiplier;
        
        // เช็คทายสกอร์ถูก (Correct Score)
        if (actual.homeScore === pred.predHome && actual.awayScore === pred.predAway) {
          points = actual.correctScorePoint * actual.multiplier * pred.multiplier;
        }
      }

      // อัปเดตคะแนนลงในแถว Prediction นั้นๆ
      if (points > 0) {
        return prisma.prediction.update({
          where: { id: pred.id },
          data: { score: points }
        });
      }
      return null;
    });

    await Promise.all(updatePromises.filter(p => p !== null));

    // 3. Mark ว่า Gameweek นี้คำนวณคะแนนแล้ว
    await prisma.gameweek.update({
      where: { gw },
      data: { calculated: true }
    });

    return { success: true, message: `Points calculated for GW ${gw} successfully!` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error calculating points." };
  }
}

export async function updateUserTotalScores() {
  try {
    // 1. ดึง User ทั้งหมด
    const users = await prisma.user.findMany();

    const updatePromises = users.map(async (user) => {
      // 2. รวมคะแนนจากตาราง Prediction ของ user คนนี้
      const aggregate = await prisma.prediction.aggregate({
        where: { userId: user.id },
        _sum: {
          score: true
        }
      });

      const totalScore = aggregate._sum.score || 0;

      // 3. อัปเดตคะแนนกลับไปที่ตาราง User
      return prisma.user.update({
        where: { id: user.id },
        data: { score: totalScore }
      });
    });

    await Promise.all(updatePromises);
    return { success: true, message: "Updated all users' total scores successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating total scores." };
  }
}