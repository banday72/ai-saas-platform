import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { HistoryClient } from "@/src/components/history/HistoryClient";
import { db } from "@/src/lib/db";

export const metadata = {
  title: "Content History",
  description: "View and manage all your generated content",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = (params.search as string) || "";
  const type = (params.type as string) || "";
  const folderId = (params.folder as string) || "";
  const tagId = (params.tag as string) || "";
  const limit = 20;

  const where: Record<string, unknown> = { userId: dbUser.id };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { prompt: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;
  if (folderId) where.folderId = folderId;
  if (tagId) {
    where.tags = { some: { tagId } };
  }

  const [generations, total, folders, tags] = await Promise.all([
    db.generation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        type: true,
        prompt: true,
        creditsUsed: true,
        createdAt: true,
        folder: { select: { id: true, name: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, color: true } } } },
      },
    }),
    db.generation.count({ where }),
    db.folder.findMany({
      where: { userId: dbUser.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: "asc" },
    }),
    db.tag.findMany({
      where: { userId: dbUser.id },
      select: { id: true, name: true, color: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <HistoryClient
      generations={generations.map((g) => ({
        ...g,
        tags: g.tags.map((t) => t.tag),
      }))}
      totalPages={totalPages}
      currentPage={page}
      total={total}
      folders={folders}
      tags={tags}
      filters={{ search, type, folderId, tagId }}
    />
  );
}
