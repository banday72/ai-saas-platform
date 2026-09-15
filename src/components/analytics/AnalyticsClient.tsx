"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { TrendingUp, Zap, BarChart3, Clock } from "lucide-react";

interface AnalyticsData {
  stats: {
    totalGenerations: number;
    generationsLast30Days: number;
    generationsLast7Days: number;
    creditsUsedLast30: number;
    creditsRemaining: number;
    monthlyCredits: number;
  };
  generationsByType: { type: string; count: number }[];
  dailyUsage: { date: string; count: number }[];
}

const TYPE_LABELS: Record<string, string> = {
  blog: "Blog Post",
  social: "Social Media",
  email: "Email",
  ad: "Ad Copy",
  website: "Website Copy",
  product: "Product Description",
  seo: "SEO Content",
};

const TYPE_COLORS: Record<string, string> = {
  blog: "#f59e0b",
  social: "#3b82f6",
  email: "#10b981",
  ad: "#ef4444",
  website: "#8b5cf6",
  product: "#ec4899",
  seo: "#06b6d4",
};

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner className="h-6 w-6 text-zinc-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-zinc-500 text-sm">
        Failed to load analytics
      </div>
    );
  }

  const maxDaily = Math.max(...data.dailyUsage.map((d) => d.count), 1);
  const maxType = Math.max(
    ...data.generationsByType.map((t) => t.count),
    1
  );

  const statCards = [
    {
      label: "Total",
      value: data.stats.totalGenerations,
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "30 Days",
      value: data.stats.generationsLast30Days,
      icon: BarChart3,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "7 Days",
      value: data.stats.generationsLast7Days,
      icon: Clock,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      label: "Credits (30d)",
      value: `${data.stats.creditsUsedLast30}/${data.stats.monthlyCredits}`,
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Analytics
        </h2>
        <p className="text-sm text-zinc-400 mt-0.5">
          Track your content generation usage
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}
                >
                  <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-px h-32">
            {data.dailyUsage.map((day, i) => (
              <div
                key={i}
                className="flex-1 group relative"
                title={`${day.date}: ${day.count}`}
              >
                <div
                  className="w-full rounded-t bg-amber-500/80 hover:bg-amber-400 transition-colors"
                  style={{
                    height: `${(day.count / maxDaily) * 100}%`,
                    minHeight: day.count > 0 ? "3px" : "0px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
            <span>{data.dailyUsage[0]?.date}</span>
            <span>
              {data.dailyUsage[data.dailyUsage.length - 1]?.date}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By Content Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {data.generationsByType.map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-28 truncate">
                  {TYPE_LABELS[item.type] ?? item.type}
                </span>
                <div className="flex-1 h-5 rounded bg-zinc-800/50 overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${(item.count / maxType) * 100}%`,
                      backgroundColor: TYPE_COLORS[item.type] || "#f59e0b",
                    }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8 text-right font-medium">
                  {item.count}
                </span>
              </div>
            ))}
            {data.generationsByType.length === 0 && (
              <p className="text-xs text-zinc-500">No data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
