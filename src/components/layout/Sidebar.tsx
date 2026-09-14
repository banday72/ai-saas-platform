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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-[68px]" : "w-60"} shrink-0 border-r border-zinc-800/80 bg-zinc-900/60 flex flex-col transition-all duration-200`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/80">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-sm text-white tracking-tight">
                ContentForge
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-100 ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Credits */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">Credits</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-500">
                {plan}
              </span>
            </div>
            <p className="text-xl font-bold text-white">{credits}</p>
            <div className="mt-2 h-1 rounded-full bg-zinc-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-3 mb-3 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 shrink-0 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-white">
            {titles[pathname] ?? "Dashboard"}
          </h1>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
