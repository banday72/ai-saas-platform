import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await db.onboardingProgress.findUnique({
      where: { clerkId: userId },
    });

    return NextResponse.json({
      progress: progress || { completedSteps: [], isComplete: false },
    });
  } catch (error) {
    console.error("Onboarding GET error:", error);
    return NextResponse.json({ error: "Failed to fetch onboarding" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { step, isComplete } = body;

    const progress = await db.onboardingProgress.upsert({
      where: { clerkId: userId },
      update: {
        completedSteps: step ? { push: step } : undefined,
        isComplete: isComplete || false,
      },
      create: {
        clerkId: userId,
        completedSteps: step ? [step] : [],
        isComplete: isComplete || false,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Onboarding POST error:", error);
    return NextResponse.json({ error: "Failed to update onboarding" }, { status: 500 });
  }
}
