export type Plan = "free" | "pro" | "business";

export interface PlanConfig {
  id: Plan;
  name: string;
  monthlyCredits: number;
  priceMonthly: number;
  stripePriceId: string;
  popular?: boolean;
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    monthlyCredits: 10,
    priceMonthly: 0,
    stripePriceId: process.env.STRIPE_PRICE_FREE ?? "price_free",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyCredits: 100,
    priceMonthly: 19,
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? "price_live_pro",
    popular: true,
  },
  business: {
    id: "business",
    name: "Business",
    monthlyCredits: 500,
    priceMonthly: 49,
    stripePriceId: process.env.STRIPE_PRICE_BUSINESS ?? "price_live_business",
  },
};

export const DEFAULT_PLAN: Plan = "free";
export const DEFAULT_CREDITS = PLANS.free.monthlyCredits;
