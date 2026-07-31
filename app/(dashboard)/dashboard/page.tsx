import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome Back! 👋</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition">
            <p className="text-slate-400 text-sm mb-2">Total Generations</p>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition">
            <p className="text-slate-400 text-sm mb-2">Credits Used</p>
            <p className="text-4xl font-bold">0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition">
            <p className="text-slate-400 text-sm mb-2">Account Status</p>
            <p className="text-4xl font-bold text-green-400">Active</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
}