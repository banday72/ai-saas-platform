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

const TYPE_GRADIENTS: Record<string, string> = {
  blog: "from-amber-500 to-orange-600",
  social: "from-blue-500 to-indigo-600",
  email: "from-emerald-500 to-green-600",
  ad: "from-rose-500 to-pink-600",
  website: "from-violet-500 to-purple-600",
  product: "from-cyan-500 to-teal-600",
  seo: "from-fuchsia-500 to-purple-600",
};

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-400">Failed to load analytics</div>;
  }

  const maxDaily = Math.max(...data.dailyUsage.map((d) => d.count), 1);
  const maxType = Math.max(...data.generationsByType.map((t) => t.count), 1);

  const statCards = [
    { label: "Total Generations", value: data.stats.totalGenerations, icon: TrendingUp, gradient: "from-violet-500 to-purple-600" },
    { label: "Last 30 Days", value: data.stats.generationsLast30Days, icon: BarChart3, gradient: "from-amber-500 to-orange-600" },
    { label: "Last 7 Days", value: data.stats.generationsLast7Days, icon: Clock, gradient: "from-cyan-500 to-blue-600" },
    {
      label: "Credits Used (30d)",
      value: `${data.stats.creditsUsedLast30} / ${data.stats.monthlyCredits}`,
      icon: Zap,
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your content generation usage over time
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Usage (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-40">
            {data.dailyUsage.map((day, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 group"
                title={`${day.date}: ${day.count} credits`}
              >
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all hover:from-amber-500 hover:to-amber-300"
                  style={{
                    height: `${(day.count / maxDaily) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "0px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{data.dailyUsage[0]?.date}</span>
            <span>{data.dailyUsage[data.dailyUsage.length - 1]?.date}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Types (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.generationsByType.map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 w-32 truncate">
                  {TYPE_LABELS[item.type] ?? item.type}
                </span>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${TYPE_GRADIENTS[item.type] || "from-amber-500 to-orange-600"} transition-all`}
                    style={{
                      width: `${(item.count / maxType) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right font-medium">{item.count}</span>
              </div>
            ))}
            {data.generationsByType.length === 0 && (
              <p className="text-slate-500 text-sm">No data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
