import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { db } from "@/src/lib/db";
import { PLANS } from "@/src/lib/plans";
import { BillingClient } from "@/src/components/billing/BillingClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui";

export const metadata = {
  title: "Billing",
  description: "Manage your subscription, view plans, and billing history",
};

export default async function BillingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);
  const plan = PLANS[dbUser.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;

  const billingHistory = await db.billingHistory.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <BillingClient
        currentPlan={dbUser.subscriptionPlan}
        hasSubscription={dbUser.subscriptionPlan !== "free"}
        creditsRemaining={dbUser.credits}
        monthlyCredits={plan.monthlyCredits}
      />

      {billingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-zinc-800">
                  <th className="py-2">Date</th>
                  <th className="py-2">Plan</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800/50">
                    <td className="py-2 text-zinc-300">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-zinc-300 capitalize">{item.plan}</td>
                    <td className="py-2">
                      <span className="capitalize rounded-full bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 text-xs text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 text-right text-zinc-300">
                      ${(item.amount / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
