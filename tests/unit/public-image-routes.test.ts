import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));

import { POST } from "@/app/api/admin/image-upload/route";
import { GET, HEAD } from "@/app/api/public-images/[filename]/route";

describe("public image routes", () => {
  const priorDir = process.env.STORAGE_DIR;
  afterEach(async () => {
    if (priorDir === undefined) delete process.env.STORAGE_DIR;
    else process.env.STORAGE_DIR = priorDir;
    getSession.mockReset();
  });

  it("requires admin authentication and rejects non-raster bytes", async () => {
    getSession.mockResolvedValue(null);
    const unauthorized = await POST(new Request("http://localhost/api/admin/image-upload", { method: "POST", headers: { "content-type": "multipart/form-data; boundary=x", "content-length": "100" }, body: "--x--\r\n" }));
    expect(unauthorized.status).toBe(401);
    getSession.mockResolvedValue({ user: { role: "admin" } });
    const form = new FormData();
    form.set("file", new File(["<svg/>"], "image.svg", { type: "image/svg+xml" }));
    const rejected = await POST(new Request("http://localhost/api/admin/image-upload", { method: "POST", body: form }));
    expect(rejected.status).toBe(400);
  });
  it("rejects a claimed image MIME with non-image content", async () => {
    getSession.mockResolvedValue({ user: { role: "admin" } });
    const form = new FormData();
    form.set("file", new File(["not an image"], "photo.png", { type: "image/png" }));
    const response = await POST(new Request("http://localhost/api/admin/image-upload", { method: "POST", body: form }));
    expect(response.status).toBe(400);
  });

  it("returns bytes and MIME through GET and matching metadata without a body through HEAD", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "schoolweb-route-"));
    process.env.STORAGE_DIR = dir;
    getSession.mockResolvedValue({ user: { role: "admin" } });
    try {
      const form = new FormData();
      const png = Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,1,2,3]);
      form.set("file", new File([png], "client-name.png", { type: "image/png" }));
      const uploaded = await POST(new Request("http://localhost/api/admin/image-upload", { method: "POST", body: form }));
      expect(uploaded.status).toBe(200);
      const { url } = await uploaded.json();
      const filename = url.split("/").pop() as string;
      const context = { params: Promise.resolve({ filename }) };
      const get = await GET(new Request(`http://localhost${url}`), context);
      expect(get.status).toBe(200);
      expect(get.headers.get("content-type")).toBe("image/png");
      expect(new Uint8Array(await get.arrayBuffer())).toEqual(png);
      const head = await HEAD(new Request(`http://localhost${url}`, { method: "HEAD" }), context);
      expect(head.status).toBe(200);
      expect(head.headers.get("content-type")).toBe(get.headers.get("content-type"));
      expect(await head.text()).toBe("");
      const unsafe = await GET(new Request("http://localhost/api/public-images/../../etc/passwd"), { params: Promise.resolve({ filename: "../../etc/passwd" }) });
      expect(unsafe.status).toBe(404);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
