import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1️⃣ ตรวจว่าเป็น Vercel Cron
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2️⃣ เรียก Supabase Edge Function
  const res = await fetch(
    "https://lybozsxmolnrjnovsmzz.supabase.co/functions/v1/update-gameweeks",
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            "X-Custom-Auth": process.env.CRON_SECRET!, // ใช้ชื่อใหม่
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    }
    );

  // 🔥 จุดชี้ขาด
  const text = await res.text();
  console.log("Supabase status:", res.status);
  console.log("Supabase response:", text);

  if (!res.ok) {
    return new Response(
      `Supabase error ${res.status}: ${text}`,
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    supabase: JSON.parse(text),
  });
}
