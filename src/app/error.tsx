"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="size-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="size-10 text-red-400" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-neutral-800 mb-2">
        Terjadi Kesalahan
      </h1>
      <p className="text-neutral-500 mb-6 max-w-md">
        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
      </p>
      <Button onClick={reset} className="gap-2 rounded-full">
        <RefreshCw className="size-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
