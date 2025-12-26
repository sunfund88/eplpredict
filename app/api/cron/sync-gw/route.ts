import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // 1. ตรวจสอบ Security (Optional: เช็ค Cron Secret จาก Vercel)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await res.json();
    const events = data.events;

    // ใช้ $transaction เพื่อรวบรวมคำสั่งส่งไปทีเดียว 
    // และลดภาระการเปิด-ปิด connection บ่อยๆ
    await prisma.$transaction(
      events.map((ev: any) => 
        prisma.gameweek.upsert({
          where: { gw: ev.id },
          update: {
            gwDeadline: new Date(ev.deadline_time),
            isCurrent: ev.is_current,
            isNext: ev.is_next,
            isFinished: ev.finished,
          },
          create: {
            gw: ev.id,
            gwDeadline: new Date(ev.deadline_time),
            isCurrent: ev.is_current,
            isNext: ev.is_next,
            isFinished: ev.finished,
          },
        })
      ),
      {
        timeout: 10000 // เพิ่มเวลาให้ transaction นี้เป็น 10 วินาที
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Gameweeks updated at 08:30 TH" 
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}