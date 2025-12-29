// app/actions/user.ts
'use server'
import prisma from "@/lib/prisma"

export async function getUserDetail(lineId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        lineId: lineId 
      },
      include: {
        predictions: {
          orderBy: {
            gw: 'desc'
          },
          include: {
            fixture: true 
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