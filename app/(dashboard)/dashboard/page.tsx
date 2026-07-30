import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <UserButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 mb-2">Total Generations</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 mb-2">Credits Used</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 mb-2">Account Status</p>
            <p className="text-3xl font-bold text-white">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}