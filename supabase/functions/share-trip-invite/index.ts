import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { tripId, email } = await req.json();
    if (!tripId || !email) {
      return json({ error: "tripId, email は必須です" }, 400);
    }
    const normalizedEmail = email.trim().toLowerCase();

    // ユーザーのJWTをそのまま転送 → RLSがそのユーザーとして適用される
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("id, title")
      .eq("id", tripId)
      .single();
    if (tripError || !trip) {
      return json({ error: "旅行が見つかりません" }, 404);
    }

    const { data: targetUser, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .ilike("email", normalizedEmail)
      .maybeSingle();
    if (lookupError) {
      return json({ error: lookupError.message }, 400);
    }
    if (!targetUser) {
      return json({ error: "このメールアドレスのユーザーが見つかりません" }, 404);
    }

    const { error: insertError } = await supabase
      .from("trip_members")
      .insert({ trip_id: tripId, user_id: targetUser.id });
    if (insertError) {
      const message =
        insertError.code === "23505" ? "すでに共有されています" : insertError.message;
      return json({ error: message }, 400);
    }

    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TripLog <onboarding@resend.dev>",
          to: normalizedEmail,
          subject: `「${trip.title}」が共有されました`,
          html: `<p>旅行「${trip.title}」があなたと共有されました。</p><p><a href="${APP_URL}/trips/${tripId}">旅行を見る</a></p>`,
        }),
      });
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
