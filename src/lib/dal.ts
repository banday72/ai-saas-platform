import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { PLANS } from "./plans";

export const getSessionUserId = cache(async () => {
  const { userId } = await auth();
  return userId;
});

export function requireUserId(userId: string | null | undefined): string {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getOrCreateUser(clerkId: string) {
  const user = await db.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      credits: PLANS.free.monthlyCredits,
      monthlyCredits: PLANS.free.monthlyCredits,
      monthlyResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    update: {},
    include: { generations: true, usageHistory: true, billingHistory: true },
  });

  return user;
}

export const getCurrentDbUser = cache(async () => {
  const clerkId = await getSessionUserId();
  if (!clerkId) return null;
  return getOrCreateUser(clerkId);
});
