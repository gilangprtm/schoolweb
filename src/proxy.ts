import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("auth_token")?.value

  // Allow public routes + static assets without auth
  const isPublic =
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/berita") ||
    pathname.startsWith("/fasilitas") ||
    pathname.startsWith("/prestasi") ||
    pathname.startsWith("/guru-dan-staf") ||
    pathname.startsWith("/galeri") ||
    pathname.startsWith("/kontak") ||
    pathname.startsWith("/pendaftaran") ||
    pathname.startsWith("/profil") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")

  // If accessing admin without auth, redirect to login
  if (pathname.startsWith("/admin") && !authToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and trying to access login page, redirect to admin
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
