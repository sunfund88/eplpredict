// app/actions/home.ts
'use server'
import prisma from "@/lib/prisma"

export async function getResultActiveGW() {
  // 1. หา GW ปัจจุบันที่ยังไม่จบ
  let targetGW = await prisma.gameweek.findFirst({
    where: {
      isCurrent: true,
      isFinished: false
    },
    select: { id: true, gw: true }
  })

  // 2. ถ้าไม่มี ให้หา GW ล่าสุดที่จบไปแล้ว
  if (!targetGW) {
    targetGW = await prisma.gameweek.findFirst({
      where: { isFinished: true },
      orderBy: { gw: 'desc' }, // เอาค่าที่มากที่สุด
      select: { id: true, gw: true }
    })
  }

  return targetGW?.gw || 1 as number // default เป็น GW1 ถ้าไม่เจอข้อมูลเลย
}

export async function getPredictActiveGW() {
  let targetGW = await prisma.gameweek.findFirst({
    where: {
      isNext: true
    },
    select: { id: true, gw: true }
  })

  return targetGW?.gw || 1 as number // default เป็น GW1 ถ้าไม่เจอข้อมูลเลย
}

export async function getFixturesByGW(gwNumber: number) {

  const fixtures = await prisma.fixture.findMany({
    where: {
      gw: gwNumber
    },
    orderBy: { kickoff: 'asc' }
  })

  return { 
    gwNumber, 
    fixtures: fixtures as any[] // หรือใส่เป็น Fixture[] ถ้าคุณย้าย Interface ไปไว้ในไฟล์ที่เรียกใช้ร่วมกันได้
  }
}