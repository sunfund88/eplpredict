// app/actions/user.ts
'use server'
import prisma from "@/lib/prisma"

export async function getUserDetail(lineId: string) {
  return await prisma.user.findUnique({
    where: { lineId: lineId }, // สมมติว่า id ใน DB ของคุณคือ lineId
    include: {
      predictions: {
        orderBy: { gw: 'desc' },
        take: 20 // ดึงประวัติการทายผลล่าสุด 10 นัด
      }
    }
  })
}