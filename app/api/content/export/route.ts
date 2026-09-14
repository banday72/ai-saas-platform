import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("id");
    const format = searchParams.get("format") || "txt";

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 });
    }

    const generation = await db.generation.findFirst({
      where: { id: contentId, userId: user.id },
    });

    if (!generation) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    let content: string;
    let contentType: string;
    let extension: string;

    if (format === "md") {
      content = `# ${generation.title}\n\n**Type:** ${generation.type}\n**Created:** ${new Date(generation.createdAt).toLocaleDateString()}\n\n---\n\n${generation.content}`;
      contentType = "text/markdown";
      extension = "md";
    } else if (format === "html") {
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${generation.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6;color:#333}h1{color:#d97706}pre{white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px}</style></head><body><h1>${generation.title}</h1><p><strong>Type:</strong> ${generation.type} | <strong>Created:</strong> ${new Date(generation.createdAt).toLocaleDateString()}</p><hr><pre>${generation.content}</pre></body></html>`;
      contentType = "text/html";
      extension = "html";
    } else {
      content = `${generation.title}\n\nType: ${generation.type}\nCreated: ${new Date(generation.createdAt).toLocaleDateString()}\n\n${"=".repeat(50)}\n\n${generation.content}`;
      contentType = "text/plain";
      extension = "txt";
    }

    const filename = `${generation.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.${extension}`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export content" }, { status: 500 });
  }
}
