import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import Link from "next/link";
import {
  PenLine,
  Sparkles,
  BarChart3,
  FileText,
  Users,
  History,
  ArrowRight,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const [totalGenerations, recentGenerations, totalTemplates] = await Promise.all([
    db.generation.count({ where: { userId: dbUser.id } }),
    db.generation.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
      },
    }),
    db.template.count({ where: { userId: dbUser.id } }),
  ]);

  const isNewUser = totalGenerations === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isNewUser ? `Welcome to ContentForge, ${user.firstName || "there"}` : `Welcome back, ${user.firstName || "there"}`}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {isNewUser
            ? "Generate AI content in seconds — blog posts, social media, emails, and more. Everything is free."
            : "Ready to create something new?"}
        </p>
      </div>

      {/* Quick Start for new users */}
      {isNewUser && (
        <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Quick Start — Create your first content
              </h3>
              <p className="text-xs text-zinc-400 mb-3">
                Pick a type, describe your topic, and AI generates publication-ready content in seconds.
              </p>
              <Link
                href="/ai-writer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Open AI Writer
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Generations
            </span>
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{totalGenerations}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Templates
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-amber-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{totalTemplates}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Status
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-400">Active</p>
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/ai-writer"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-amber-500/30 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <PenLine className="h-4 w-4 text-amber-500" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">AI Writer</h4>
            <p className="text-xs text-zinc-500">Generate blog posts, social media, emails, ads, and more.</p>
          </Link>
          <Link
            href="/history"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
              <History className="h-4 w-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">History</h4>
            <p className="text-xs text-zinc-500">Browse, search, and manage all your generated content.</p>
          </Link>
          <Link
            href="/templates"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
              <FileText className="h-4 w-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Templates</h4>
            <p className="text-xs text-zinc-500">Save and reuse your best prompts for faster creation.</p>
          </Link>
          <Link
            href="/analytics"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Analytics</h4>
            <p className="text-xs text-zinc-500">Track your content generation stats and trends.</p>
          </Link>
          <Link
            href="/team"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
              <Users className="h-4 w-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Team</h4>
            <p className="text-xs text-zinc-500">Create a team and collaborate on content together.</p>
          </Link>
          <Link
            href="/settings"
            className="group p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Settings</h4>
            <p className="text-xs text-zinc-500">Manage your account and profile preferences.</p>
          </Link>
        </div>
      </div>

      {/* Recent generations */}
      {recentGenerations.length > 0 && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Recent Generations
            </h3>
            <Link href="/history" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="px-5 pb-4">
            <div className="divide-y divide-zinc-800/80">
              {recentGenerations.map((gen) => (
                <a
                  key={gen.id}
                  href={`/content/${gen.id}`}
                  className="flex items-center justify-between py-3 -mx-5 px-5 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {gen.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {gen.type} ·{" "}
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
