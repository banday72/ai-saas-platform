import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Settings
        </h2>
        <p className="text-sm text-zinc-400 mt-0.5">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white",
                headerSubtitle: "text-zinc-400",
                formFieldInput:
                  "bg-zinc-800 border-zinc-700 text-white",
                formButtonPrimary:
                  "bg-amber-500 hover:bg-amber-400 text-black",
                navbar: "bg-zinc-900",
                navbarConnectionStatusIndicator: "bg-emerald-500",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
