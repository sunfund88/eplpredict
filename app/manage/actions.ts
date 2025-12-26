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