import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/src/lib/db";
import { PLANS } from "@/src/lib/plans";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let evt: WebhookEvent;
  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      case "user.created": {
        const email = data.email_addresses?.[0]?.email_address ?? "";
        await db.user.upsert({
          where: { clerkId: data.id },
          update: {
            email,
            name: data.first_name
              ? `${data.first_name} ${data.last_name ?? ""}`.trim()
              : undefined,
            image: data.image_url ?? undefined,
          },
          create: {
            clerkId: data.id,
            email,
            name: data.first_name
              ? `${data.first_name} ${data.last_name ?? ""}`.trim()
              : null,
            image: data.image_url ?? null,
            credits: PLANS.free.monthlyCredits,
            monthlyCredits: PLANS.free.monthlyCredits,
            monthlyResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        break;
      }

      case "user.updated": {
        const email = data.email_addresses?.[0]?.email_address ?? "";
        await db.user.update({
          where: { clerkId: data.id },
          data: {
            email,
            name: data.first_name
              ? `${data.first_name} ${data.last_name ?? ""}`.trim()
              : undefined,
            image: data.image_url ?? undefined,
          },
        });
        break;
      }

      case "user.deleted": {
        if (data.id) {
          await db.user.deleteMany({ where: { clerkId: data.id } });
        }
        break;
      }
    }
  } catch (error) {
    console.error(`Webhook ${type} error:`, error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
