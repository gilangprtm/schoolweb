import { randomUUID } from "node:crypto";
import { mkdir, open, unlink } from "node:fs/promises";
import path from "node:path";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
function storageRoot() {
  const root = process.env.STORAGE_DIR || path.join(process.cwd(), "storage");
  if (!path.isAbsolute(root)) throw new Error("STORAGE_DIR must be an absolute path");
  return path.resolve(/* turbopackIgnore: true */ root);
}
const MIME_EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;
export type ImageMime = keyof typeof MIME_EXTENSIONS;

export function detectRasterMime(bytes: Uint8Array): ImageMime | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "image/png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP") return "image/webp";
  return null;
}

export function storedImagePath(filename: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(filename)) throw new Error("Invalid stored image name");
  return path.join(storageRoot(), "images", filename);
}

export async function savePublicImage(bytes: Uint8Array): Promise<{ filename: string; url: string; mime: ImageMime }> {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_SIZE) throw new RangeError("Invalid image size");
  const mime = detectRasterMime(bytes);
  if (!mime) throw new TypeError("Unsupported image content");
  const filename = `${randomUUID()}.${MIME_EXTENSIONS[mime]}`;
  const target = storedImagePath(filename);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  const handle = await open(target, "wx", 0o600);
  try { await handle.writeFile(bytes); } catch (error) { await handle.close(); await unlink(target).catch(() => {}); throw error; }
  await handle.close();
  return { filename, url: `/api/public-images/${filename}`, mime };
}

export async function removeOwnedImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const match = /^\/api\/public-images\/([0-9a-f-]+\.(?:jpg|png|webp))$/.exec(url);
  if (!match) return;
  await unlink(storedImagePath(match[1])).catch((error: NodeJS.ErrnoException) => { if (error.code !== "ENOENT") throw error; });
}
