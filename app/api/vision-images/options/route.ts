import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSupabase } from "@/lib/server-supabase";

export async function GET() {
  try {
    const serverSupabase = getServerSupabase();

    const { data: lifeAreas, error: lifeAreasError } = await serverSupabase
      .from("life_areas")
      .select("id, name, slug, type")
      .eq("type", "ai_vision")
      .order("created_at", { ascending: true });

    if (lifeAreasError) {
      return NextResponse.json(
        { error: `Failed to fetch life areas: ${lifeAreasError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ life_areas: lifeAreas }, { status: 200 });
  } catch (err) {
    console.error("[vision-images options] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
