// app/actions/user.ts
'use server'
import prisma from "@/lib/prisma"

export async function getUserDetail(lineId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        lineId: lineId 
      },
      // เพิ่มส่วนนี้เพื่อดึงประวัติการทายผลมาโชว์ในหน้า Page
      include: {
        predictions: {
          orderBy: {
            gw: 'desc'
          }
        }
      }
    });
    return user;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return null;
  }
}