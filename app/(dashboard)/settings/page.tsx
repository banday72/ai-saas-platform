import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export const metadata = {
  title: "Settings",
  description: "Manage your account details and preferences",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account details and preferences.
        </p>
      </div>

      <div className="max-w-2xl">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
