import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { db } from "@/src/lib/db";
import { TemplatesClient } from "@/src/components/templates/TemplatesClient";

export const metadata = {
  title: "Templates",
  description: "Manage your content generation templates",
};

export default async function TemplatesPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const templates = await db.template.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return <TemplatesClient templates={templates} />;
}
