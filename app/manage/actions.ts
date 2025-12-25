// app/manage/actions.ts
'use server'

import prisma from "@/lib/prisma"

export async function fetchAndSaveFixtures(gw: number) {
  try {
    const response = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`)
    const data = await response.json()

    // วนลูปจัดการข้อมูลจาก FPL API
    const promises = data.map((item: any) => {
      return prisma.fixture.upsert({
        where: { id: item.code }, // ใช้ code เป็น id 
        update: {
          gw: item.event, // event 
          kickoff: new Date(item.kickoff_time), // kickoff_time 
          home: String(item.team_h), // team_h 
          away: String(item.team_a), // team_a 
          homeScore: item.team_h_score, // team_h_score 
          awayScore: item.team_a_score, // team_a_score 
          finished: item.finished,
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
          multiplier: 1, // ค่า default 
        },
      })
    })

    await Promise.all(promises)
    return { success: true, message: `Updated GW ${gw} successfully!` }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Failed to fetch data" }
  }
}