import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ai-writer", label: "AI Writer" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-slate-900">
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 overflow-y-auto">
        <h2 className="text-white font-bold text-xl mb-8">AI SaaS</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-800 bg-slate-900 px-8 py-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
          <UserButton />
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}