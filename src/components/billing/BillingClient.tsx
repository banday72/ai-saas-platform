"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui";
import { Sparkles } from "lucide-react";

export function BillingClient() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Billing
        </h2>
        <p className="text-sm text-zinc-400 mt-0.5">Your plan and usage</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Free Plan</CardTitle>
              <p className="text-sm text-zinc-400">
                Everything included — unlimited usage
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Unlimited content generations",
              "All 7 content types",
              "Templates and content history",
              "Analytics dashboard",
              "Team collaboration",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
