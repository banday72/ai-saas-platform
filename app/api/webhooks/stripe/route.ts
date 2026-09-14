import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/src/lib/stripe";
import { db } from "@/src/lib/db";
import { PLANS, type Plan } from "@/src/lib/plans";
import { sendLowCreditsEmail, sendBillingReceiptEmail } from "@/src/lib/email";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function findUserByStripeCustomer(customerId: string) {
  return db.user.findFirst({ where: { stripeId: customerId } });
}

async function applyPlan(userId: string, plan: Plan) {
  const config = PLANS[plan];
  const nextReset = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: plan,
      credits: config.monthlyCredits,
      monthlyCredits: config.monthlyCredits,
      monthlyResetDate: nextReset,
    },
  });
}

async function recordBilling(
  userId: string,
  data: {
    amount: number;
    status: string;
    stripeId?: string;
    plan: string;
  }
) {
  await db.billingHistory.create({
    data: {
      userId,
      amount: data.amount,
      status: data.status,
      stripeId: data.stripeId,
      plan: data.plan,
      period: "month",
    },
  });
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      if (customerId) {
        const user = await findUserByStripeCustomer(customerId);
        if (user) {
          const plan: Plan = session.metadata?.plan
            ? (session.metadata.plan as Plan)
            : "pro";
          await applyPlan(user.id, plan);
          await recordBilling(user.id, {
            amount: session.amount_total ?? 0,
            status: "paid",
            stripeId: session.id,
            plan: PLANS[plan].name,
          });

          await sendBillingReceiptEmail(
            user.email,
            user.name,
            session.amount_total ?? 0,
            PLANS[plan].name
          );
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null;
      if (customerId) {
        const user = await findUserByStripeCustomer(customerId);
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              subscriptionPlan: "free",
              subscriptionId: null,
            },
          });
        }
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;
      if (customerId) {
        const user = await findUserByStripeCustomer(customerId);
        if (user) {
          const subRef = (invoice as { subscription?: unknown }).subscription;
          const subId = typeof subRef === "string" ? subRef : null;
          if (subId) {
            await db.user.update({
              where: { id: user.id },
              data: { subscriptionId: subId },
            });
          }
          await recordBilling(user.id, {
            amount: invoice.amount_paid ?? 0,
            status: "paid",
            stripeId: typeof invoice.id === "string" ? invoice.id : undefined,
            plan:
              user.subscriptionPlan === "free" ? "Pro" : user.subscriptionPlan,
          });

          if (user.credits <= 2) {
            const config = PLANS[user.subscriptionPlan as keyof typeof PLANS] ?? PLANS.free;
            await sendLowCreditsEmail(
              user.email,
              user.name,
              user.credits,
              config.name
            );
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
