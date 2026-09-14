import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingClient } from "@/src/components/onboarding/OnboardingClient";
import { db } from "@/src/lib/db";

export const metadata = {
  title: "Getting Started - AI SaaS",
  description: "Set up your account and start generating content",
};

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const progress = await db.onboardingProgress.findUnique({
    where: { clerkId: user.id },
  });

  if (progress?.isComplete) redirect("/dashboard");

  return (
    <OnboardingClient
      completedSteps={progress?.completedSteps || []}
      userName={user.firstName || "there"}
    />
  );
}
