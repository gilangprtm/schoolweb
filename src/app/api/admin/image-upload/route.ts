import { auth } from "@/lib/auth";
import { MAX_IMAGE_SIZE, savePublicImage } from "@/lib/public-image-storage";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader && /^\d+$/.test(lengthHeader) && Number(lengthHeader) > MAX_IMAGE_SIZE + 64 * 1024) {
    return Response.json({ error: "Request too large" }, { status: 413 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) {
    return Response.json({ error: "Expected multipart upload" }, { status: 415 });
  }

  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Missing request body" }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_IMAGE_SIZE + 64 * 1024) {
        await reader.cancel();
        return Response.json({ error: "Request too large" }, { status: 413 });
      }
      chunks.push(value);
    }
    const body = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const form = await new Request(request.url, { method: "POST", headers: request.headers, body }).formData();
    const files = form.getAll("file");
    if (files.length !== 1 || !(files[0] instanceof File)) {
      return Response.json({ error: "Expected one image file" }, { status: 400 });
    }
    const file = files[0];
    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return Response.json({ error: "Image must be at most 5 MB" }, { status: 413 });
    }
    const saved = await savePublicImage(new Uint8Array(await file.arrayBuffer()));
    return Response.json({ url: saved.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid upload" }, {
      status: error instanceof RangeError ? 413 : 400,
    });
  }
}
