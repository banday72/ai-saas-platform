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
import { Check, Zap, Star, Crown } from "lucide-react";

const PLANS_DATA = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    credits: 10,
    features: ["10 credits / month", "Blog & social posts", "Basic support"],
    icon: Zap,
  },
  {
    id: "pro",
    name: "Professional",
    price: 19,
    credits: 100,
    popular: true,
    features: [
      "100 credits / month",
      "All 7 content types",
      "SEO optimization",
      "Priority support",
    ],
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
      "REST API access",
    ],
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
  const creditsPercent =
    monthlyCredits > 0 ? (creditsUsed / monthlyCredits) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Billing
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your subscription and usage.
          </p>
        </div>
        {hasSubscription && (
          <Button
            variant="secondary"
            onClick={openPortal}
            loading={portalLoading}
            size="sm"
          >
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
              <span className="font-semibold text-amber-500 capitalize">
                {currentPlan}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Credits this month</span>
                <span className="text-white font-medium">
                  {creditsUsed} / {monthlyCredits}
                </span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${Math.min(creditsPercent, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-base font-semibold text-white mb-4">Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS_DATA.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative p-5 rounded-xl border ${
                  plan.popular
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black rounded-full">
                    Popular
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.popular
                        ? "bg-amber-500/10 border border-amber-500/20"
                        : "bg-zinc-800 border border-zinc-700/50"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        plan.popular ? "text-amber-500" : "text-zinc-400"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {plan.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">/mo</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-zinc-400"
                    >
                      <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button
                    className="w-full"
                    variant="secondary"
                    disabled
                    size="sm"
                  >
                    Current Plan
                  </Button>
                ) : plan.id === "free" ? (
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={openPortal}
                    loading={portalLoading}
                    size="sm"
                  >
                    Downgrade
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => startCheckout(plan.id)}
                    loading={loadingPlan === plan.id}
                    size="sm"
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
