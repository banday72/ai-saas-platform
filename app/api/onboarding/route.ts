import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";

const ONBOARDING_STEPS = ["profile", "first-generation", "template", "team", "billing"] as const;

const OnboardingStepSchema = z.object({
  step: z.enum(ONBOARDING_STEPS),
  isComplete: z.boolean().optional().default(false),
});

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
    const parsed = OnboardingStepSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { step, isComplete } = parsed.data;

    const progress = await db.onboardingProgress.upsert({
      where: { clerkId: userId },
      update: {
        completedSteps: { push: step },
        isComplete,
      },
      create: {
        clerkId: userId,
        completedSteps: [step],
        isComplete,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Onboarding POST error:", error);
    return NextResponse.json({ error: "Failed to update onboarding" }, { status: 500 });
  }
}
