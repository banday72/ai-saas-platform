import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";
import { PLANS } from "@/src/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const planId = (body.planId ?? "pro") as keyof typeof PLANS;

    const plan = PLANS[planId];
    if (!plan || plan.id === "free") {
      return NextResponse.json(
        { error: "Invalid plan." },
        { status: 400 }
      );
    }

    const dbUser = await getOrCreateUser(userId);

    let stripeCustomerId = dbUser.stripeId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress ?? undefined,
        name: user.firstName
          ? `${user.firstName} ${user.lastName ?? ""}`.trim()
          : undefined,
        metadata: { clerkId: userId },
      });
      stripeCustomerId = customer.id;
      await db.user.update({
        where: { id: dbUser.id },
        data: { stripeId: customer.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=1`,
      metadata: { clerkId: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
