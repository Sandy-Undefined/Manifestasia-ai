import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/server-auth";
import { getServerSupabase } from "@/lib/server-supabase";

const VISION_IMAGES_BUCKET = "vision-images";
const STORAGE_LIST_LIMIT = 1000;

type ServerSupabase = ReturnType<typeof getServerSupabase>;
type StorageObject = {
  name: string;
  id?: string | null;
};

async function collectStoragePaths(
  serverSupabase: ServerSupabase,
  bucket: string,
  prefix: string
): Promise<{ paths: string[]; error: string | null }> {
  const paths: string[] = [];
  const folders = [prefix];

  while (folders.length > 0) {
    const folder = folders.pop();
    if (!folder) continue;

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await serverSupabase.storage.from(bucket).list(folder, {
        limit: STORAGE_LIST_LIMIT,
        offset,
      });

      if (error) {
        return { paths, error: error.message };
      }

      const objects = (data ?? []) as StorageObject[];

      for (const object of objects) {
        if (!object.name) continue;

        const path = `${folder}/${object.name}`;
        if (object.id === null) {
          folders.push(path);
        } else {
          paths.push(path);
        }
      }

      hasMore = objects.length === STORAGE_LIST_LIMIT;
      offset += STORAGE_LIST_LIMIT;
    }
  }

  return { paths, error: null };
}

async function deleteUserVisionImages(
  serverSupabase: ServerSupabase,
  userId: string
): Promise<string | null> {
  const { paths, error } = await collectStoragePaths(
    serverSupabase,
    VISION_IMAGES_BUCKET,
    userId
  );

  if (error) {
    return error;
  }

  for (let index = 0; index < paths.length; index += STORAGE_LIST_LIMIT) {
    const chunk = paths.slice(index, index + STORAGE_LIST_LIMIT);
    if (chunk.length === 0) continue;

    const { error: removeError } = await serverSupabase.storage
      .from(VISION_IMAGES_BUCKET)
      .remove(chunk);

    if (removeError) {
      return removeError.message;
    }
  }

  return null;
}

async function deleteAccount(req: Request) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const serverSupabase = getServerSupabase();
    const storageError = await deleteUserVisionImages(serverSupabase, user.id);

    if (storageError) {
      return NextResponse.json(
        { error: `Failed to delete stored images: ${storageError}` },
        { status: 400 }
      );
    }

    const { error: deleteError } = await serverSupabase.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete account: ${deleteError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[account delete] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  return deleteAccount(req);
}

export async function POST(req: Request) {
  return deleteAccount(req);
}

export async function GET() {
  return NextResponse.json(
    {
      status: "available",
      message:
        "Account deletion is available for authenticated users. Call this endpoint with DELETE or POST and a Supabase access token.",
      methods: ["DELETE", "POST"],
      required_header: "Authorization: Bearer <supabase_access_token>",
      support_email: "support@manifestasia.ai",
    },
    { status: 200 }
  );
}
