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
  let user = await db.user.findUnique({
    where: { clerkId },
    include: { generations: true, usageHistory: true, billingHistory: true },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId,
        email: "",
        credits: PLANS.free.monthlyCredits,
        monthlyCredits: PLANS.free.monthlyCredits,
        monthlyResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { generations: true, usageHistory: true, billingHistory: true },
    });
  }

  return user;
}

export const getCurrentDbUser = cache(async () => {
  const clerkId = await getSessionUserId();
  if (!clerkId) return null;
  return getOrCreateUser(clerkId);
});
