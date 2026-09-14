import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import { PLANS } from "@/src/lib/plans";
import Link from "next/link";
import { PenLine, CreditCard, Sparkles } from "lucide-react";

export const metadata = {
  title: "Dashboard",
  description: "Your AI SaaS dashboard - overview of your account and usage",
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

  const plan = PLANS[dbUser.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;
  const creditsUsed = plan.monthlyCredits - dbUser.credits;
  const creditsPercent = plan.monthlyCredits > 0 ? (creditsUsed / plan.monthlyCredits) * 100 : 0;

  const stats = [
    {
      label: "Total Generations",
      value: totalGenerations,
      gradient: "from-violet-500 to-purple-600",
      icon: Sparkles,
    },
    {
      label: "Credits Used",
      value: `${Math.max(0, creditsUsed)} / ${plan.monthlyCredits}`,
      gradient: "from-amber-500 to-orange-600",
      icon: CreditCard,
    },
    {
      label: "Account Status",
      value: "Active",
      gradient: "from-emerald-500 to-green-600",
      icon: PenLine,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">
          <span className="text-white">Welcome back, </span>
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{user.firstName || "there"}</span>
          <span className="text-white">!</span>
        </h2>
        <p className="text-slate-400 mt-1">
          You have{" "}
          <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{dbUser.credits}</span>{" "}
          credits remaining on the{" "}
          <span className="capitalize font-semibold text-white">{dbUser.subscriptionPlan}</span>{" "}
          plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/5 p-6" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Monthly Credit Usage</span>
          <span className="text-sm font-medium text-white">{Math.round(creditsPercent)}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${Math.min(creditsPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 p-8 text-center group hover:border-amber-500/30 transition-all duration-300" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.02) 100%)" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <PenLine className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Start Creating Content</h3>
          <p className="text-slate-400 mb-4">
            Use the AI Writer to generate blog posts, social media content,
            emails, and more in seconds.
          </p>
          <Link
            href="/ai-writer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20"
          >
            Go to AI Writer
          </Link>
        </div>

        <div className="rounded-2xl border border-white/5 p-8 text-center group hover:border-violet-500/30 transition-all duration-300" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0.02) 100%)" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <CreditCard className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Need More Credits?</h3>
          <p className="text-slate-400 mb-4">
            Upgrade to a Pro or Business plan for more monthly credits and
            advanced features.
          </p>
          <Link
            href="/billing"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/20"
          >
            View Plans
          </Link>
        </div>
      </div>

      {recentGenerations.length > 0 && (
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="px-6 pt-6 pb-3">
            <h3 className="text-lg font-bold text-white">Recent Generations</h3>
          </div>
          <div className="px-6 pb-6 divide-y divide-white/5">
            {recentGenerations.map((gen) => (
              <a
                key={gen.id}
                href={`/content/${gen.id}`}
                className="flex items-center justify-between py-3 hover:bg-white/5 -mx-6 px-6 transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-white">{gen.title}</p>
                  <p className="text-xs text-slate-500">
                    {gen.type} · {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 px-2.5 py-1 rounded-full">
                  {gen.creditsUsed} credit
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
