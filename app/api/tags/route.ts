import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional().default("#6366f1"),
});

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const tags = await db.tag.findMany({
      where: { userId: user.id },
      include: { _count: { select: { generations: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Tags GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
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
    const parsed = CreateTagSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { name, color } = parsed.data;

    const tag = await db.tag.create({
      data: {
        userId: user.id,
        name: name.toLowerCase().trim(),
        color,
      },
    });

    return NextResponse.json({ tag });
  } catch (error) {
    console.error("Tags POST error:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
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
    const tagId = searchParams.get("id");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await db.tag.deleteMany({
      where: { id: tagId, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tags DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
