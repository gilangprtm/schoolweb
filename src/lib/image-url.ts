export function normalizeAdminImageUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("/")) return trimmed;
  const isDriveFileLink = /^https?:\/\/drive\.google\.com\/file\/d\/([^/]+)/i.exec(trimmed);
  if (isDriveFileLink) return `https://docs.google.com/uc?id=${isDriveFileLink[1]}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const id = trimmed.match(/[?&]id=([^&]+)/)?.[1] || trimmed.match(/\/d\/([^/]+)/)?.[1];
  return id ? `https://docs.google.com/uc?id=${id}` : `https://docs.google.com/uc?id=${trimmed}`;
}
