import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import { PLANS } from "@/src/lib/plans";
import Link from "next/link";
import {
  ArrowUpRight,
  PenLine,
  CreditCard,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const [totalGenerations, recentGenerations] = await Promise.all([
    db.generation.count({ where: { userId: dbUser.id } }),
    db.generation.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        creditsUsed: true,
      },
    }),
  ]);

  const plan =
    PLANS[dbUser.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;
  const creditsUsed = plan.monthlyCredits - dbUser.credits;
  const creditsPercent =
    plan.monthlyCredits > 0 ? (creditsUsed / plan.monthlyCredits) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {user.firstName || "there"}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          You have{" "}
          <span className="font-medium text-amber-500">{dbUser.credits}</span>{" "}
          credits on the{" "}
          <span className="font-medium text-white capitalize">
            {dbUser.subscriptionPlan}
          </span>{" "}
          plan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Generations
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{totalGenerations}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Credits Used
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.max(0, creditsUsed)}
            <span className="text-sm font-normal text-zinc-500">
              {" "}
              / {plan.monthlyCredits}
            </span>
          </p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">Active</p>
        </div>
      </div>

      {/* Credit usage bar */}
      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Credit usage this month</span>
          <span className="text-sm font-medium text-white">
            {Math.round(creditsPercent)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${Math.min(creditsPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/ai-writer"
          className="group p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                <PenLine className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Start Creating
              </h3>
              <p className="text-xs text-zinc-400">
                Generate blog posts, social media, emails, and more with AI.
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </Link>
        <Link
          href="/billing"
          className="group p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
                <CreditCard className="h-5 w-5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Need More Credits?
              </h3>
              <p className="text-xs text-zinc-400">
                Upgrade to Pro or Business for more monthly credits.
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent */}
      {recentGenerations.length > 0 && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-white">
              Recent Generations
            </h3>
          </div>
          <div className="px-5 pb-5">
            <div className="divide-y divide-zinc-800/80">
              {recentGenerations.map((gen) => (
                <a
                  key={gen.id}
                  href={`/content/${gen.id}`}
                  className="flex items-center justify-between py-3 -mx-5 px-5 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {gen.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {gen.type} ·{" "}
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0 ml-4">
                    {gen.creditsUsed} credit
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {recentGenerations.length === 0 && (
        <div className="p-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4">
            <PenLine className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            No content yet
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            Start by generating your first piece of content.
          </p>
          <Link
            href="/ai-writer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            <PenLine className="h-3.5 w-3.5" />
            Go to AI Writer
          </Link>
        </div>
      )}
    </div>
  );
}
