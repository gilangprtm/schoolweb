"use client"

import ImageWithFallback from "@/components/shared/ImageWithFallback"
import { cn } from "@/lib/utils"

/**
 * Reusable image preview for admin forms.
 *
 * Accepts a FULL URL (Google Drive `uc?id=...` or any other image URL like
 * placehold.co) and renders it reliably via next/image + ImageWithFallback.
 * It normalizes Google Drive URLs to the direct CDN form when possible, and
 * falls back gracefully for every other image host.
 */
export default function ImagePreview({
  src,
  alt = "Preview",
  aspect = "video",
  rounded = "rounded-lg",
  className,
  imgClassName,
}: {
  src: string
  alt?: string
  /** video = 16/9, square = 1/1 */
  aspect?: "video" | "square"
  rounded?: string
  className?: string
  imgClassName?: string
}) {
  if (!src) return null

  const driveMatch =
    src.match(/[?&]id=([^&]+)/) || src.match(/\/d\/([^/]+)/)

  const displaySrc = driveMatch
    ? `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w1200`
    : src.includes("://")
      ? src
      : `https://lh3.googleusercontent.com/d/${src.trim()}=w1200`

  return (
    <div
      className={cn(
        "relative w-full max-w-xs overflow-hidden border border-neutral-200 bg-neutral-50",
        aspect === "video" ? "aspect-video" : "aspect-square",
        rounded,
        className
      )}
    >
      <ImageWithFallback
        src={displaySrc}
        alt={alt}
        fill
        rounded="rounded-none"
        className={cn("h-full", imgClassName)}
      />
    </div>
  )
}
