import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AiWriterClient } from "@/src/components/writer/AiWriterClient";
import { getOrCreateUser } from "@/src/lib/dal";
import { db } from "@/src/lib/db";

export const metadata = {
  title: "AI Writer",
  description: "Generate blog posts, social media content, emails, and ad copy with AI",
};

export default async function AiWriterPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const history = await db.generation.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, type: true, createdAt: true },
  });

  return <AiWriterClient history={history} />;
}
