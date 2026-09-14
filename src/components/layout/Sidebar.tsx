"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PenLine,
  CreditCard,
  Settings,
  History,
  FileText,
  BarChart3,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-amber-500 to-orange-600" },
  { href: "/ai-writer", label: "AI Writer", icon: PenLine, color: "from-violet-500 to-purple-600" },
  { href: "/history", label: "History", icon: History, color: "from-cyan-500 to-blue-600" },
  { href: "/templates", label: "Templates", icon: FileText, color: "from-emerald-500 to-green-600" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, color: "from-pink-500 to-rose-600" },
  { href: "/billing", label: "Billing", icon: CreditCard, color: "from-blue-500 to-indigo-600" },
  { href: "/team", label: "Team", icon: Users, color: "from-teal-500 to-cyan-600" },
  { href: "/settings", label: "Settings", icon: Settings, color: "from-slate-400 to-slate-500" },
];

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ai-writer": "AI Writer",
  "/history": "Content History",
  "/templates": "Templates",
  "/analytics": "Analytics",
  "/billing": "Billing",
  "/team": "Team",
  "/settings": "Settings",
  "/onboarding": "Getting Started",
};

export function Sidebar({
  credits,
  plan,
  children,
}: {
  credits: number;
  plan: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen" style={{ background: "#0a0a1a" }}>
      <aside className="w-64 shrink-0 border-r border-white/5 p-6 overflow-y-auto flex flex-col" style={{ background: "linear-gradient(180deg, #0f0f2a 0%, #0a0a1a 100%)" }}>
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-white">AI SaaS</span>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                style={isActive ? { boxShadow: `0 4px 15px -3px rgba(245, 158, 11, 0.3)` } : {}}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl p-4 border border-white/5" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(139,92,246,0.1) 100%)" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Credits remaining</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white capitalize">
              {plan}
            </span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{credits}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-white/5 px-8 py-4 flex justify-between items-center" style={{ background: "rgba(10,10,26,0.8)", backdropFilter: "blur(12px)" }}>
          <h1 className="text-white text-xl font-bold">
            {titles[pathname] ?? "Dashboard"}
          </h1>
          <UserButton />
        </div>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
