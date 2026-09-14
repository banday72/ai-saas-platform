"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Check, Crown, Zap, Star } from "lucide-react";

const PLANS_DATA = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 10,
    features: ["10 credits / month", "Blog & social posts", "Basic support"],
    gradient: "from-slate-500 to-slate-600",
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    credits: 100,
    popular: true,
    features: [
      "100 credits / month",
      "All content types",
      "SEO optimization",
      "Priority support",
    ],
    gradient: "from-amber-500 to-orange-600",
    icon: Star,
  },
  {
    id: "business",
    name: "Business",
    price: 49,
    credits: 500,
    features: [
      "500 credits / month",
      "Everything in Pro",
      "Agency accounts",
      "API access",
    ],
    gradient: "from-violet-500 to-purple-600",
    icon: Crown,
  },
];

export function BillingClient({
  currentPlan,
  hasSubscription,
  creditsRemaining,
  monthlyCredits,
}: {
  currentPlan: string;
  hasSubscription: boolean;
  creditsRemaining: number;
  monthlyCredits: number;
}) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(planId: string) {
    setLoadingPlan(planId);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.assign(data.url);
      } else {
        setError(data.error ?? "Could not start checkout.");
      }
    } catch {
      setError("Could not start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/manage", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        window.location.assign(data.url);
      } else {
        setError(data.error ?? "Could not open billing portal.");
      }
    } catch {
      setError("Could not open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  const creditsUsed = monthlyCredits - creditsRemaining;
  const creditsPercent = monthlyCredits > 0 ? (creditsUsed / monthlyCredits) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your subscription and usage.
          </p>
        </div>
        {hasSubscription && (
          <Button variant="secondary" onClick={openPortal} loading={portalLoading}>
            Manage Subscription
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {hasSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your active subscription is{" "}
              <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent capitalize">
                {currentPlan}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Credits this month</span>
                <span className="text-white font-medium">
                  {creditsUsed} / {monthlyCredits}
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                  style={{ width: `${Math.min(creditsPercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {creditsRemaining} credits remaining
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS_DATA.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.popular ? "border-amber-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-slate-400">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Button className="w-full" variant="secondary" disabled>
                      Current Plan
                    </Button>
                  ) : plan.id === "free" ? (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => openPortal()}
                      loading={portalLoading}
                    >
                      Downgrade
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => startCheckout(plan.id)}
                      loading={loadingPlan === plan.id}
                      disabled={isCurrent}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
