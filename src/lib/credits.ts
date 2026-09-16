import "server-only";

import { db } from "./db";
import { getOrCreateUser } from "./dal";
import { PLANS } from "./plans";

export interface CreditResult {
  ok: boolean;
  reason?: "insufficient" | "error";
  creditsLeft: number;
}

export async function hasEnoughCredits(clerkId: string, cost = 1): Promise<boolean> {
  const user = await getOrCreateUser(clerkId);
  return user.credits >= cost;
}

export async function spendCredits(
  clerkId: string,
  cost = 1
): Promise<CreditResult> {
  try {
    const user = await getOrCreateUser(clerkId);
    if (user.credits < cost) {
      return { ok: false, reason: "insufficient", creditsLeft: user.credits };
    }
    const updated = await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: cost } },
    });
    await db.usageHistory.create({
      data: {
        userId: user.id,
        type: "generation",
        amount: cost,
      },
    });
    return { ok: true, creditsLeft: updated.credits };
  } catch {
    return { ok: false, reason: "error", creditsLeft: 0 };
  }
}

export async function addCredits(clerkId: string, amount: number) {
  const user = await getOrCreateUser(clerkId);
  return db.user.update({
    where: { id: user.id },
    data: { credits: { increment: amount } },
  });
}

export async function resetMonthlyCreditsIfNeeded(clerkId: string) {
  const user = await getOrCreateUser(clerkId);
  const now = new Date();
  if (user.monthlyResetDate && now < user.monthlyResetDate) return user;

  const config = PLANS[user.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;
  const nextReset = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return db.user.update({
    where: { id: user.id },
    data: {
      credits: config.monthlyCredits,
      monthlyCredits: config.monthlyCredits,
      monthlyResetDate: nextReset,
    },
  });
}

export function isPublicUser(userId: string | null | undefined): boolean {
  return !userId;
}
