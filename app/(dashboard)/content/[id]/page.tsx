import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { db } from "@/src/lib/db";
import { ContentDetailClient } from "@/src/components/content/ContentDetailClient";

export const metadata = {
  title: "Content Detail",
  description: "View your generated content",
};

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);
  const { id } = await params;

  const generation = await db.generation.findFirst({
    where: { id, userId: dbUser.id },
    include: {
      folder: { select: { id: true, name: true, color: true } },
      tags: { select: { tag: { select: { id: true, name: true, color: true } } } },
    },
  });

  if (!generation) notFound();

  const folders = await db.folder.findMany({
    where: { userId: dbUser.id },
    select: { id: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  const tags = await db.tag.findMany({
    where: { userId: dbUser.id },
    select: { id: true, name: true, color: true },
    orderBy: { name: "asc" },
  });

  return (
    <ContentDetailClient
      generation={{
        ...generation,
        tags: generation.tags.map((t) => t.tag),
      }}
      folders={folders}
      tags={tags}
      creditsLeft={999999}
    />
  );
}
