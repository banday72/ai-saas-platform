import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <UserButton />
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-white text-xl font-bold mb-4">Welcome!</h2>
        <p className="text-slate-300">Your AI SaaS Dashboard</p>
      </div>
    </div>
  );
}