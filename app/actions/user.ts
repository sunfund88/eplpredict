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
          include: {
            fixture: true 
          },
          orderBy: [
            { gw: 'desc' },
            { fixture: { kickoff: 'desc' } }
          ]
        }
      }
    });
    return user;
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return null;
  }
}