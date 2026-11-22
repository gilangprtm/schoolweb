import { describe, expect, it } from "vitest";
import { normalizeAdminImageUrl } from "@/lib/image-url";

describe("normalizeAdminImageUrl", () => {
  it("preserves public and legacy relative image paths", () => {
    expect(normalizeAdminImageUrl("/api/public-images/photo.png")).toBe("/api/public-images/photo.png");
    expect(normalizeAdminImageUrl("/uploads/photo.png")).toBe("/uploads/photo.png");
  });

  it("normalizes Drive IDs and links", () => {
    expect(normalizeAdminImageUrl("drive-file-id")).toBe("https://docs.google.com/uc?id=drive-file-id");
    expect(normalizeAdminImageUrl("https://drive.google.com/file/d/drive-file-id/view")).toBe("https://docs.google.com/uc?id=drive-file-id");
  });

  it("preserves external absolute URLs", () => {
    expect(normalizeAdminImageUrl("https://images.example.com/photo.png")).toBe("https://images.example.com/photo.png");
  });
});
