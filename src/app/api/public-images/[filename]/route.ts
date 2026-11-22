import { open } from "node:fs/promises";
import { storedImagePath } from "@/lib/public-image-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

async function serve(request: Request, filename: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(filename)) return new Response(null, { status: 404 });
  let handle;
  try {
    const path = storedImagePath(filename);
    handle = await open(path, "r");
    const info = await handle.stat();
    if (!info.isFile()) { await handle.close(); return new Response(null, { status: 404 }); }
    const headers = { "Content-Type": types[filename.slice(filename.lastIndexOf(".") + 1)], "Content-Length": String(info.size), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff", "Content-Disposition": "inline" };
    if (request.method === "HEAD") { await handle.close(); return new Response(null, { headers }); }
    const file = handle;
    handle = undefined;
    const body = new ReadableStream<Uint8Array>({ async pull(controller) { const buffer = new Uint8Array(64 * 1024); try { const { bytesRead } = await file.read(buffer); if (!bytesRead) { controller.close(); await file.close(); } else controller.enqueue(buffer.subarray(0, bytesRead)); } catch (error) { controller.error(error); await file.close(); } }, async cancel() { await file.close(); } }, { highWaterMark: 0 });
    return new Response(body, { headers });
  } catch { if (handle) await handle.close().catch(() => {}); return new Response(null, { status: 404 }); }
}

export async function GET(request: Request, context: { params: Promise<{ filename: string }> }) { return serve(request, (await context.params).filename); }
export async function HEAD(request: Request, context: { params: Promise<{ filename: string }> }) { return serve(request, (await context.params).filename); }
