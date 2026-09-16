import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

const CreateFolderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional().default("#f59e0b"),
});

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const folders = await db.folder.findMany({
      where: { userId: user.id },
      include: { _count: { select: { generations: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Folders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const parsed = CreateFolderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { name, color } = parsed.data;

    const folder = await db.folder.create({
      data: {
        userId: user.id,
        name,
        color,
      },
    });

    return NextResponse.json({ folder });
  } catch (error) {
    console.error("Folders POST error:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("id");

    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    await db.folder.deleteMany({
      where: { id: folderId, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Folders DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
