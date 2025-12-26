/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const cron = req.headers.get("X-Custom-Auth"); // รับจากชื่อใหม่
  if (cron !== Deno.env.get("CRON_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await res.json();
    const events = data.events;

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const payload = events.map((ev: any) => ({
      gw: ev.id,
      gwDeadline: ev.deadline_time,
      isCurrent: ev.is_current,
      isNext: ev.is_next,
      isFinished: ev.finished,
    }));

    const { error } = await supabase
      .from("Gameweek")
      .upsert(payload, { onConflict: "gw" });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, updated: payload.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge error:", err);
    return new Response("Internal Error", { status: 500 });
  }
});
