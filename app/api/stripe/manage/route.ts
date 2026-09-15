import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { error: "All features are free. No subscription to manage." },
    { status: 400 }
  );
}
