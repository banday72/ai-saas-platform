import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { TeamClient } from "@/src/components/team/TeamClient";
import { db } from "@/src/lib/db";

export const metadata = {
  title: "Team - AI SaaS",
  description: "Manage your team and agency accounts",
};

export default async function TeamPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const [memberships, ownedTeams] = await Promise.all([
    db.teamMember.findMany({
      where: { userId: dbUser.id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true },
                },
              },
            },
          },
        },
      },
    }),
    db.team.findMany({
      where: { ownerId: dbUser.id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    }),
  ]);

  return (
    <TeamClient
      memberships={memberships.map((m) => ({
        ...m,
        team: {
          ...m.team,
          members: m.team.members.map((mem) => ({
            ...mem,
            user: {
              ...mem.user,
              name: mem.user.name ?? null,
              image: mem.user.image ?? null,
            },
          })),
        },
      }))}
      ownedTeams={ownedTeams.map((t) => ({
        ...t,
        members: t.members.map((mem) => ({
          ...mem,
          user: {
            ...mem.user,
            name: mem.user.name ?? null,
            image: mem.user.image ?? null,
          },
        })),
      }))}
      currentPlan={dbUser.subscriptionPlan}
    />
  );
}
