import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-8xl font-heading font-extrabold text-primary/20 mb-4 select-none">
        404
      </div>
      <h1 className="font-heading text-2xl font-bold text-neutral-800 mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-neutral-500 mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button className="gap-2 rounded-full">
            <Home className="size-4" />
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/berita">
          <Button variant="outline" className="gap-2 rounded-full">
            <Search className="size-4" />
            Jelajahi Berita
          </Button>
        </Link>
      </div>
    </div>
  );
}
