"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";

function setAuthCookie(role: string) {
  // Fake auth: set a simple cookie for middleware to check
  document.cookie = `auth_token=fake-token-${role}; path=/; max-age=86400; SameSite=Lax`;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    // Fake accounts
    const accounts: Record<
      string,
      { password: string; role: string; redirect: string }
    > = {
      "admin@sekolah.sch.id": {
        password: "admin123",
        role: "admin",
        redirect: "/admin",
      },
      "guru@sekolah.sch.id": {
        password: "guru123",
        role: "guru",
        redirect: "/admin",
      },
      "staff@sekolah.sch.id": {
        password: "staff123",
        role: "staff",
        redirect: "/admin",
      },
    };

    const account = accounts[email];
    if (account && account.password === password) {
      setAuthCookie(account.role);
      router.push(account.redirect);
    } else {
      setError("Email atau password salah");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — School Image */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden"
        style={{
          backgroundImage: "url(/images/hero-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px]" />
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center space-y-3">
            <img
              src="/images/logo.png"
              alt="Logo Sekolah"
              className="w-16 h-16 mx-auto rounded-xl bg-primary/5 p-2"
            />
            <h1
              className="text-2xl font-bold text-neutral-900"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Panel Sekolah
            </h1>
          </div>

          <div>
            <h2
              className="text-xl font-semibold text-neutral-900"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Masuk
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Masukkan kredensial untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="admin@sekolah.sch.id"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                "Memverifikasi..."
              ) : (
                <span className="flex items-center gap-2">
                  Masuk <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="p-4 rounded-lg bg-neutral-100 border border-neutral-200 space-y-1">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
              Akun Demo
            </p>
            <p className="text-xs text-neutral-500">
              <span className="font-mono text-neutral-700">
                admin@sekolah.sch.id
              </span>{" "}
              / admin123 <span className="text-neutral-400">— Admin</span>
            </p>
            <p className="text-xs text-neutral-500">
              <span className="font-mono text-neutral-700">
                guru@sekolah.sch.id
              </span>{" "}
              / guru123 <span className="text-neutral-400">— Guru</span>
            </p>
            <p className="text-xs text-neutral-500">
              <span className="font-mono text-neutral-700">
                staff@sekolah.sch.id
              </span>{" "}
              / staff123 <span className="text-neutral-400">— Staff</span>
            </p>
          </div>

          <p className="text-xs text-center text-neutral-400">
            &copy; {new Date().getFullYear()} SMP Negeri 17 Denpasar
          </p>
        </div>
      </div>
    </div>
  );
}
