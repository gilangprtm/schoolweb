import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

interface UploadResult {
  filename: string;
  url: string;
}

/**
 * Upload a file to /public/uploads/{directory}/
 * Returns { filename, url } for storing in the database.
 */
export async function uploadFile(
  file: File,
  directory: string = "general"
): Promise<UploadResult> {
  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Format file tidak didukung. Gunakan: JPG, PNG, WebP, atau SVG.`
    );
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
    );
  }

  // Ensure directory exists
  const targetDir = join(UPLOAD_DIR, directory);
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  // Generate unique filename
  const ext = EXTENSIONS[file.type] || ".bin";
  const filename = `${randomUUID()}${ext}`;
  const filePath = join(targetDir, filename);

  // Write file
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Return public URL path
  const url = `/uploads/${directory}/${filename}`;

  return { filename, url };
}

/**
 * Delete a file from /public/uploads/ given its public URL path.
 */
export async function deleteFile(url: string): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) {
    return; // Not a local upload, skip
  }

  const filePath = join(process.cwd(), "public", url);

  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch {
    // File might already be deleted — ignore
  }
}
