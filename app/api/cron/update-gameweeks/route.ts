import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 🔐 ป้องกันคนยิงมั่ว
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(
      "https://lybozsxmolnrjnovsmzz.supabase.co/functions/v1/update-gameweeks",
      {
        method: "POST",
        headers: {
          "x-cron-secret": process.env.CRON_SECRET!,
        },
      }
    );

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      supabase: data,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return new Response("Cron Failed", { status: 500 });
  }
}
