/**
 * @jest-environment node
 */

import { DELETE, GET, POST } from "@/app/api/account/delete/route";
import { getUserFromRequest } from "@/lib/server-auth";
import { getServerSupabase } from "@/lib/server-supabase";

jest.mock("@/lib/server-auth", () => ({
  getUserFromRequest: jest.fn(),
}));

jest.mock("@/lib/server-supabase", () => ({
  getServerSupabase: jest.fn(),
}));

const mockGetUserFromRequest = getUserFromRequest as jest.MockedFunction<
  typeof getUserFromRequest
>;
const mockGetServerSupabase = getServerSupabase as jest.MockedFunction<
  typeof getServerSupabase
>;

function createRequest(method: "DELETE" | "GET" | "POST" = "DELETE") {
  return new Request("https://example.com/api/account/delete", {
    method,
    headers: { Authorization: "Bearer test-token" },
  });
}

function mockServerSupabase(options?: {
  storageListError?: { message: string };
  storageRemoveError?: { message: string };
  deleteUserError?: { message: string };
}) {
  const list = jest.fn().mockResolvedValue({
    data: [
      { id: "image-1", name: "image-1.png" },
      { id: "image-2", name: "image-2.png" },
    ],
    error: options?.storageListError ?? null,
  });
  const remove = jest.fn().mockResolvedValue({
    error: options?.storageRemoveError ?? null,
  });
  const from = jest.fn(() => ({ list, remove }));
  const deleteUser = jest.fn().mockResolvedValue({
    error: options?.deleteUserError ?? null,
  });

  const serverSupabase = {
    storage: { from },
    auth: { admin: { deleteUser } },
  };

  mockGetServerSupabase.mockReturnValue(
    serverSupabase as unknown as ReturnType<typeof getServerSupabase>
  );

  return { from, list, remove, deleteUser };
}

describe("/api/account/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires an authenticated user", async () => {
    mockGetUserFromRequest.mockResolvedValue({
      user: null,
      error: "Unauthorized",
    });

    const response = await DELETE(createRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(mockGetServerSupabase).not.toHaveBeenCalled();
  });

  it("returns browser-safe endpoint instructions for GET", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "available",
      methods: ["DELETE", "POST"],
      required_header: "Authorization: Bearer <supabase_access_token>",
      support_email: "support@manifestasia.ai",
    });
    expect(mockGetUserFromRequest).not.toHaveBeenCalled();
    expect(mockGetServerSupabase).not.toHaveBeenCalled();
  });

  it("deletes user storage files and the auth account", async () => {
    mockGetUserFromRequest.mockResolvedValue({
      user: { id: "user-123", email: "test@example.com" },
      error: null,
    });
    const serverSupabase = mockServerSupabase();

    const response = await DELETE(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(serverSupabase.from).toHaveBeenCalledWith("vision-images");
    expect(serverSupabase.list).toHaveBeenCalledWith("user-123", {
      limit: 1000,
      offset: 0,
    });
    expect(serverSupabase.remove).toHaveBeenCalledWith([
      "user-123/image-1.png",
      "user-123/image-2.png",
    ]);
    expect(serverSupabase.deleteUser).toHaveBeenCalledWith("user-123");
  });

  it("supports POST clients as well as DELETE", async () => {
    mockGetUserFromRequest.mockResolvedValue({
      user: { id: "user-123" },
      error: null,
    });
    const serverSupabase = mockServerSupabase();

    const response = await POST(createRequest("POST"));

    expect(response.status).toBe(200);
    expect(serverSupabase.deleteUser).toHaveBeenCalledWith("user-123");
  });

  it("does not delete the auth account when storage cleanup fails", async () => {
    mockGetUserFromRequest.mockResolvedValue({
      user: { id: "user-123" },
      error: null,
    });
    const serverSupabase = mockServerSupabase({
      storageRemoveError: { message: "remove failed" },
    });

    const response = await DELETE(createRequest());
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Failed to delete stored images: remove failed",
    });
    expect(serverSupabase.deleteUser).not.toHaveBeenCalled();
  });
});
