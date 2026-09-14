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
  FolderOpen,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-writer", label: "AI Writer", icon: PenLine },
  { href: "/history", label: "History", icon: History },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
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
    <div className="flex h-screen bg-slate-900">
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 p-6 overflow-y-auto flex flex-col">
        <h2 className="text-white font-bold text-xl mb-8">AI SaaS</h2>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400">Credits remaining</p>
            <span className="rounded-full bg-amber-600/20 border border-amber-600/40 px-2 py-0.5 text-xs font-medium text-amber-400 capitalize">
              {plan}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{credits}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-slate-800 bg-slate-900 px-8 py-4 flex justify-between items-center">
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
