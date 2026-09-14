"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your content generation usage over time
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Generations", value: data.stats.totalGenerations },
          { label: "Last 30 Days", value: data.stats.generationsLast30Days },
          { label: "Last 7 Days", value: data.stats.generationsLast7Days },
          {
            label: "Credits Used (30d)",
            value: `${data.stats.creditsUsedLast30} / ${data.stats.monthlyCredits}`,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
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
                className="flex-1 flex flex-col items-center gap-1"
                title={`${day.date}: ${day.count} credits`}
              >
                <div
                  className="w-full bg-amber-500 rounded-t transition-all hover:bg-amber-400"
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
                <div className="flex-1 h-6 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / maxType) * 100}%`,
                      backgroundColor: TYPE_COLORS[item.type] || "#f59e0b",
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-12 text-right">{item.count}</span>
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
