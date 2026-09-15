export type Plan = "free";

export interface PlanConfig {
  id: Plan;
  name: string;
  monthlyCredits: number;
  priceMonthly: number;
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    monthlyCredits: 999999,
    priceMonthly: 0,
  },
};

export const DEFAULT_PLAN: Plan = "free";
export const DEFAULT_CREDITS = PLANS.free.monthlyCredits;
