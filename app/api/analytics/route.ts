import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import { PLANS } from "@/src/lib/plans";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const plan = PLANS[user.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalGenerations,
      generationsLast30Days,
      generationsLast7Days,
      generationsByType,
      recentUsage,
      creditsUsedLast30Days,
    ] = await Promise.all([
      db.generation.count({ where: { userId: user.id } }),
      db.generation.count({
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
      }),
      db.generation.count({
        where: { userId: user.id, createdAt: { gte: sevenDaysAgo } },
      }),
      db.generation.groupBy({
        by: ["type"],
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      db.usageHistory.findMany({
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true, amount: true, type: true },
      }),
      db.usageHistory.aggregate({
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      }),
    ]);

    const dailyUsage: { date: string; count: number }[] = [];
    const usageByDate: Record<string, number> = {};
    recentUsage.forEach((entry) => {
      const date = entry.createdAt.toISOString().split("T")[0];
      usageByDate[date] = (usageByDate[date] || 0) + entry.amount;
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      dailyUsage.push({ date: dateStr, count: usageByDate[dateStr] || 0 });
    }

    return NextResponse.json({
      stats: {
        totalGenerations,
        generationsLast30Days,
        generationsLast7Days,
        creditsUsedLast30: creditsUsedLast30Days._sum.amount || 0,
        creditsRemaining: user.credits,
        monthlyCredits: plan.monthlyCredits,
      },
      generationsByType: generationsByType.map((g) => ({
        type: g.type,
        count: g._count.id,
      })),
      dailyUsage,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
