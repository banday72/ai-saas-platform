import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { AnalyticsClient } from "@/src/components/analytics/AnalyticsClient";

export const metadata = {
  title: "Analytics - AI SaaS",
  description: "Track your content generation usage and analytics",
};

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  return <AnalyticsClient />;
}
