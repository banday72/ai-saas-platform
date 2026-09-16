import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { authenticateApiKey } from "@/src/lib/api-auth";
import { spendCredits } from "@/src/lib/credits";

const DEMO_CONTENT: Record<string, (topic: string) => string> = {
  blog: (topic) => `Title: ${topic}\n\nA comprehensive guide covering the essential aspects of ${topic}. This article explores key strategies, best practices, and actionable tips to help you succeed.\n\n## Key Takeaways\n\n- Start with clear objectives\n- Focus on quality over quantity\n- Measure your results consistently\n- Iterate and improve over time`,
  social: (topic) => `Ready to level up your ${topic} game? 🚀\n\nHere are 3 tips that actually work:\n1. Focus on value first\n2. Be consistent with your message\n3. Engage with your audience daily\n\n#Marketing #Growth #Tips`,
  email: (topic) => `Subject: A fresh approach to ${topic}\n\nHi there,\n\nI wanted to share a quick insight about ${topic} that could help you see better results.\n\nThe key is to start small, measure consistently, and optimize based on data.\n\nBest,\nThe Team`,
  ad: (topic) => `Headline: Master ${topic} Today\nBody: Join thousands of professionals using smart strategies to succeed.\nCTA: Start Free →`,
  website: (topic) => `# ${topic}\n\n## Professional solutions for modern teams\n\nOur platform helps you achieve more with less effort.\n\n- Easy to use\n- Proven results\n- Free to start`,
  product: (topic) => `# ${topic}\n\nA comprehensive solution designed for modern teams. Features include automation, analytics, and seamless integration.\n\nGet started free today.`,
  seo: (topic) => `Title: ${topic} Guide\nMeta: Complete guide to ${topic} with tips and strategies.\n\n## What is ${topic}?\n## How to Get Started\n## Best Practices\n## FAQ`,
};

const GenerateRequestSchema = z.object({
  type: z.enum(["blog", "social", "email", "ad", "website", "product", "seo"]).default("blog"),
  prompt: z.string().min(1, "Prompt is required").max(10000, "Prompt is too long"),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const user = await authenticateApiKey(apiKey);
    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { type, prompt } = parsed.data;

    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const hasOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("placeholder");
    let content: string;

    if (hasOpenAI) {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        instructions: "Write high-quality content about the topic provided.",
        input: prompt,
      });
      content = response.output_text;
    } else {
      const generator = DEMO_CONTENT[type] ?? DEMO_CONTENT.blog;
      content = generator(prompt);
    }

    const titleMatch = content.match(/^Title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : prompt.slice(0, 60);

    const generation = await db.generation.create({
      data: {
        userId: user.id,
        type,
        title,
        content,
        prompt,
        creditsUsed: 1,
      },
    });

    await spendCredits(user.clerkId, 1);

    return NextResponse.json({
      id: generation.id,
      content,
      type,
      title,
    });
  } catch (error) {
    console.error("API generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
