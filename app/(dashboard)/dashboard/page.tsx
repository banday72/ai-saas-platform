import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import { PLANS } from "@/src/lib/plans";
import Link from "next/link";

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

  const stats = [
    { label: "Total Generations", value: totalGenerations, color: "text-white" },
    {
      label: "Credits Used",
      value: `${Math.max(0, creditsUsed)} / ${plan.monthlyCredits}`,
      color: "text-white",
    },
    {
      label: "Account Status",
      value: "Active",
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back, {user.firstName || "there"}!
        </h2>
        <p className="text-slate-400 mt-1">
          You have{" "}
          <span className="font-semibold text-amber-400">{dbUser.credits}</span>{" "}
          credits remaining on the{" "}
          <span className="capitalize font-semibold">{dbUser.subscriptionPlan}</span>{" "}
          plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition"
          >
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <h3 className="text-lg font-bold mb-2">Start Creating Content</h3>
          <p className="text-slate-400 mb-4">
            Use the AI Writer to generate blog posts, social media content,
            emails, and more in seconds.
          </p>
          <Link
            href="/ai-writer"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition"
          >
            Go to AI Writer
          </Link>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <h3 className="text-lg font-bold mb-2">Need More Credits?</h3>
          <p className="text-slate-400 mb-4">
            Upgrade to a Pro or Business plan for more monthly credits and
            advanced features.
          </p>
          <Link
            href="/billing"
            className="inline-block px-6 py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition"
          >
            View Plans
          </Link>
        </div>
      </div>

      {recentGenerations.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="px-6 pt-6 pb-3">
            <h3 className="text-lg font-bold">Recent Generations</h3>
          </div>
          <div className="px-6 pb-6 divide-y divide-slate-700">
            {recentGenerations.map((gen) => (
              <a
                key={gen.id}
                href={`/content/${gen.id}`}
                className="flex items-center justify-between py-3 hover:bg-slate-700/30 -mx-6 px-6 transition"
              >
                <div>
                  <p className="text-sm font-medium">{gen.title}</p>
                  <p className="text-xs text-slate-500">
                    {gen.type} · {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-slate-500">
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
