"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  rounded?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
  aspect = "16/9",
  priority = false,
  fill = false,
  width,
  height,
  sizes,
  rounded = "rounded-xl",
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackSrc = fallback || "/images/placeholder.jpg";

  const showPlaceholder = error || !src;

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "bg-neutral-100 flex items-center justify-center",
          rounded,
          className
        )}
        style={!fill ? { aspectRatio: aspect } : undefined}
      >
        <div className="text-center text-neutral-400">
          <ImageIcon className="size-10 mx-auto mb-1 opacity-50" />
          <span className="text-xs">{alt || "Gambar tidak tersedia"}</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={cn("relative", rounded, "overflow-hidden", className)}>
        {loading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            rounded,
            loading ? "opacity-0" : "opacity-100"
          )}
          sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
          priority={priority}
          onError={() => setError(true)}
          onLoad={() => setLoading(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", rounded, className)}
      style={{ aspectRatio: aspect }}
    >
      {loading && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={cn(
          "object-cover w-full h-full transition-opacity duration-500",
          rounded,
          loading ? "opacity-0" : "opacity-100"
        )}
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
