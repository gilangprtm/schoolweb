import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lightweight health check — no DB dependency
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error" },
      { status: 500 }
    );
  }
}
