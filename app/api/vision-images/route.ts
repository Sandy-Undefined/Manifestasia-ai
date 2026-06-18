import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { getUserFromRequest } from "@/lib/server-auth";

type VisionImageMetadata = Record<string, unknown> | null;

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

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) return null;

  const [, contentType, base64] = match;
  return {
    contentType,
    buffer: Buffer.from(base64, "base64"),
  };
}

/** Accept data URLs, bare base64, or http(s) image URLs */
async function parseImageInput(image: string): Promise<{
  contentType: string;
  buffer: Buffer;
} | null> {
  const trimmed = image.trim();
  const fromData = parseDataUrl(trimmed);
  if (fromData) {
    return { contentType: fromData.contentType, buffer: fromData.buffer };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const res = await fetch(trimmed);
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      const ct =
        res.headers.get("content-type")?.split(";")[0]?.trim() || "image/png";
      return { contentType: ct, buffer: buf };
    } catch {
      return null;
    }
  }

  const cleaned = trimmed.replace(/\s/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length > 20) {
    try {
      return {
        contentType: "image/png",
        buffer: Buffer.from(cleaned, "base64"),
      };
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const serverSupabase = getServerSupabase();

    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await req.json();
    const {
      image,
      metadata,
      life_areas,
      realism_booster,
      output_type,
      model_quality,
      vision_describe,
    }: {
      image?: string
      metadata?: VisionImageMetadata
      life_areas?: string[]
      realism_booster?: string[]
      output_type?: string
      model_quality?: string
      vision_describe?: string
    } =
      body ?? {};

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "image (base64 data URL) is required" },
        { status: 400 }
      );
    }

    const parsed = await parseImageInput(image);
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "Invalid image format. Use a data URL (data:image/...;base64,...), a public image URL, or raw base64.",
        },
        { status: 400 }
      );
    }

    const { contentType, buffer } = parsed;
    const extension = contentType.split("/")[1] ?? "png";
    const fileName = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const bucket = "vision-images";

    const { error: uploadError } = await serverSupabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 400 }
      );
    }

    const {
      data: { publicUrl },
    } = serverSupabase.storage.from(bucket).getPublicUrl(fileName);

    const { data, error: insertError } = await serverSupabase
      .from("ai_vision_images")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        metadata: metadata ?? null,
        life_areas: life_areas ?? null,
        realism_booster: realism_booster ?? null,
        output_type: output_type ?? null,
        model_quality: model_quality ?? null,
        vision_describe: vision_describe ?? null,

      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to save image record: ${insertError.message}` },
        { status: 400 }
      );
    }

    const { error: activityError } = await serverSupabase.rpc(
      "record_user_activity",
      {
        p_user_id: user.id,
        p_action_type: "ai_vision",
      }
    );

    if (activityError) {
      console.error("[vision-images] activity tracking error:", activityError);
    }

    return NextResponse.json({ image: data }, { status: 201 });
  } catch (err) {
    console.error("[vision-images] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const serverSupabase = getServerSupabase();
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const url = new URL(req.url)
    const options = url.searchParams.get('options')

    if (options === '1' || options === 'true') {
      const { data: lifeAreas, error: lifeAreasError } = await serverSupabase
        .from("life_areas")
        .select("id, name, slug, type")
        .eq("type", "ai_vision")

      if (lifeAreasError) {
        return NextResponse.json(
          { error: `Failed to fetch options: ${lifeAreasError.message}` },
          { status: 400 }
        );
      }
      return NextResponse.json({ life_areas: lifeAreas }, { status: 200 });
    }

    const { data, error } = await serverSupabase
      .from("ai_vision_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch images: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ images: data }, { status: 200 });
  } catch (err) {
    console.error("[vision-images] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

