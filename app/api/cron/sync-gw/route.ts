import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // 1. ตรวจสอบ Security (Optional: เช็ค Cron Secret จาก Vercel)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // ตัวอย่างการแก้ไขในส่วน Fetch ข้อมูล
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
      // แนะนำให้ใส่ Headers เพื่อให้เหมือนการเรียกจาก Browser ปกติ
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      cache: 'no-store' // ป้องกันการจำค่าเก่าที่อาจจะผิดพลาด
    });

    // 1. เช็คว่าเรียกสำเร็จไหม (Status 200)
    if (!response.ok) {
      throw new Error(`FPL API error: ${response.status}`);
    }

    // 2. เช็คว่ามีข้อมูลส่งกลับมาไหมก่อน parse
    const data = await response.json();
    const events = data.events;
    let processedCount = 0;

    console.log(`Starting sync for ${events.length} events...`);

    // ใช้ for...of เพื่อความชัวร์
    for (const ev of events) {
      const result = await prisma.gameweek.upsert({
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
          calculated: false,
        },
      });

      processedCount++;
      if (ev.id === 38) {
        console.log("GW 38 Upsert Result:", JSON.stringify(result));
      }
    }

    console.log(`Successfully processed ${processedCount} gameweeks.`);

    return NextResponse.json({ 
      success: true, 
      processed: processedCount 
    });
    
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}