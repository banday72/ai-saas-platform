import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const templates = await db.template.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Templates GET error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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
    const { name, description, type, prompt, isPublic } = body;

    if (!name || !type || !prompt) {
      return NextResponse.json({ error: "Name, type, and prompt are required" }, { status: 400 });
    }

    const template = await db.template.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        type,
        prompt,
        isPublic: isPublic || false,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Templates POST error:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
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
    const templateId = searchParams.get("id");

    if (!templateId) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
    }

    await db.template.deleteMany({
      where: { id: templateId, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Templates DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
