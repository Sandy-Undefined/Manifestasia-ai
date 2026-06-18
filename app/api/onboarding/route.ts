import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromRequest } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      full_name,
      life_areas,
      emotional_state,
      intentions,
      challenges,
    } = body;

    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { error } = await supabase.rpc("complete_onboarding", {
      p_user_id: user.id,
      p_full_name: full_name,
      p_life_areas: life_areas,
      p_emotional_state: emotional_state,
      p_intentions: intentions,
      p_challenges: challenges,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { data: lifeAreas, error: lifeAreasError } = await supabase
      .from("life_areas")
      .select("*");
    const { data: emotionalStates, error: emotionalStatesError } =
      await supabase.from("emotional_states").select("*");
    const { data: intentions, error: intentionsError } = await supabase
      .from("intentions")
      .select("*");
    const { data: challenges, error: challengesError } = await supabase
      .from("challenges")
      .select("*");

    if (
      lifeAreasError ||
      emotionalStatesError ||
      intentionsError ||
      challengesError
    ) {
      return NextResponse.json(
        {
          error:
            lifeAreasError?.message ??
            emotionalStatesError?.message ??
            intentionsError?.message ??
            challengesError?.message ??
            "Failed to fetch onboarding data",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      life_areas: lifeAreas,
      emotional_states: emotionalStates,
      intentions,
      challenges,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}