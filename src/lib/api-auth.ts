import "server-only";

import { db } from "./db";

export async function authenticateApiKey(apiKey: string) {
  if (!apiKey) return null;

  const user = await db.user.findUnique({
    where: { apiKey },
    select: {
      id: true,
      clerkId: true,
      email: true,
      subscriptionPlan: true,
      credits: true,
    },
  });

  return user;
}
