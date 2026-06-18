import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserFromRequest } from "@/lib/server-auth";

function getServerSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is required.");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function streakLevelFromStreak(streak: number): number {
  if (streak >= 30) return 5;
  if (streak >= 21) return 4;
  if (streak >= 14) return 3;
  if (streak >= 7) return 2;
  if (streak >= 3) return 1;
  return 0;
}

export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const serverSupabase = getServerSupabase();

    const { data: profile, error: profileError } = await serverSupabase
      .from("profiles")
      .select(
        "total_sessions, journal_entries, ai_visions_generated, scripts_created, weekly_generations_used, weekly_generation_limit"
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: `Failed to fetch profile metrics: ${profileError.message}` },
        { status: 400 }
      );
    }

    const { data: streakRow, error: streakError } = await serverSupabase
      .from("streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", user.id)
      .maybeSingle();

    if (streakError) {
      return NextResponse.json(
        { error: streakError.message },
        { status: 400 }
      );
    }

    const currentStreak = streakRow?.current_streak ?? 0;
    const longestStreak = streakRow?.longest_streak ?? 0;

    const body = {
      total_sessions: profile?.total_sessions ?? 0,
      journal_entries: profile?.journal_entries ?? 0,
      ai_visions_generated: profile?.ai_visions_generated ?? 0,
      scripts_created: profile?.scripts_created ?? 0,
      weekly_generations_used: profile?.weekly_generations_used ?? 0,
      weekly_generation_limit: profile?.weekly_generation_limit ?? 5,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      streak_level: streakLevelFromStreak(currentStreak),
    };

    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    console.error("[progress] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
