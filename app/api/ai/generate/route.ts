import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/src/lib/db";
import { getOrCreateUser, requireUserId } from "@/src/lib/dal";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const PROMPTS: Record<string, string> = {
  blog: `You are an expert content marketer. Write a compelling, well-structured blog post about the topic provided. Include an engaging title (prefixed with "Title: "), a strong introduction, use headings, bullet points, and a clear conclusion. Write in a professional yet conversational tone.`,
  social: `You are a social media strategist. Create engaging social media content for the topic provided. Include a catchy hook, relevant hashtags, and a call-to-action. Output ready-to-post content.`,
  email: `You are an expert email copywriter. Write a high-converting email about the topic provided. Include a subject line (prefixed with "Subject: "), personalized opening, clear body, and a strong call-to-action.`,
  ad: `You are an expert advertising copywriter. Write compelling ad copy for the topic provided. Include a headline, body copy, and a clear call-to-action. Make it persuasive and conversion-focused.`,
  website: `You are an expert web copywriter. Write persuasive website copy for the topic provided. Include a hero headline, subheadline, feature sections, and a call-to-action.`,
  product: `You are an expert product copywriter. Write detailed product description copy for the topic provided. Highlight features and benefits in a compelling way.`,
  seo: `You are an SEO specialist. Write SEO-optimized content for the topic provided. Include a focus keyword, meta title, meta description, and an outline with keyword-rich headings.`,
};

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId: rawUserId } = await auth();
    const userId = requireUserId(rawUserId);

    const body = await req.json();
    const type = (body.type ?? "blog") as string;
    const prompt = (body.prompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const user = await getOrCreateUser(userId);

    if (user.credits < 1) {
      return NextResponse.json(
        { error: "You have run out of credits. Please upgrade your plan." },
        { status: 402 }
      );
    }

    const instructions = PROMPTS[type] ?? PROMPTS.blog;

    let content: string;
    try {
      const response = await getOpenAI().responses.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        instructions,
        input: prompt,
      });
      content = response.output_text;
    } catch (openaiError) {
      console.error("OpenAI error:", openaiError);
      return NextResponse.json(
        { error: "Failed to generate content. Please try again." },
        { status: 500 }
      );
    }

    const title = extractTitle(content) || prompt.slice(0, 60);
    const [updatedUser, generation] = await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      db.generation.create({
        data: {
          userId: user.id,
          type,
          title,
          content,
          prompt,
          creditsUsed: 1,
        },
      }),
    ]);

    await db.usageHistory.create({
      data: { userId: user.id, type, amount: 1 },
    });

    return NextResponse.json({
      content,
      type,
      title,
      creditsLeft: updatedUser.credits,
      id: generation.id,
    });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^Title:\s*(.+)$/m);
  if (titleMatch) return titleMatch[1].trim();
  const firstLine = content.split("\n").find((l) => l.trim());
  return firstLine ? firstLine.trim().slice(0, 100) : null;
}
