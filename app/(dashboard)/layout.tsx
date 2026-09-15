import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { getOrCreateUser } from "@/src/lib/dal";
import { resetMonthlyCreditsIfNeeded } from "@/src/lib/credits";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | ContentForge AI",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  await resetMonthlyCreditsIfNeeded(user.id);
  const dbUser = await getOrCreateUser(user.id);

  return (
    <Sidebar credits={dbUser.credits} plan={dbUser.subscriptionPlan} monthlyCredits={dbUser.monthlyCredits}>
      {children}
    </Sidebar>
  );
}
