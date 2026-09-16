import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

const UpdateContentSchema = z.object({
  folderId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { folderId, tagIds } = parsed.data;

    const generation = await db.generation.findFirst({
      where: { id, userId: user.id },
    });

    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (folderId) {
      const folder = await db.folder.findFirst({
        where: { id: folderId, userId: user.id },
      });
      if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
      }
    }

    await db.generation.update({
      where: { id },
      data: {
        folderId: folderId || null,
      },
    });

    if (tagIds !== undefined) {
      await db.generationTag.deleteMany({
        where: { generationId: id },
      });

      if (tagIds.length > 0) {
        const validTags = await db.tag.findMany({
          where: { id: { in: tagIds }, userId: user.id },
          select: { id: true },
        });
        const validTagIds = validTags.map((t) => t.id);

        if (validTagIds.length > 0) {
          await db.generationTag.createMany({
            data: validTagIds.map((tagId) => ({
              generationId: id,
              tagId,
            })),
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content PATCH error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const { id } = await params;

    const generation = await db.generation.findFirst({
      where: { id, userId: user.id },
    });

    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.generation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
