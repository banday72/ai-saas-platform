import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/src/lib/dal";
import { TeamClient } from "@/src/components/team/TeamClient";
import { db } from "@/src/lib/db";

export const metadata = {
  title: "Team",
  description: "Manage your team and agency accounts",
};

export default async function TeamPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getOrCreateUser(user.id);

  const ownedTeams = await db.team.findMany({
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
  });

  return (
    <TeamClient
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
    />
  );
}
