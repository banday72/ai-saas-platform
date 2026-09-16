import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { getOrCreateUser } from "@/src/lib/dal";

const InviteMemberSchema = z.object({
  teamId: z.string().min(1),
  email: z.string().email("Invalid email format"),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const body = await req.json();
    const parsed = InviteMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { teamId, email } = parsed.data;

    const team = await db.team.findFirst({
      where: { id: teamId, ownerId: user.id },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found or you're not the owner" }, { status: 404 });
    }

    const invitee = await db.user.findUnique({ where: { email } });
    if (!invitee) {
      return NextResponse.json({ error: "User not found with that email" }, { status: 404 });
    }

    const existing = await db.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: invitee.id } },
    });

    if (existing) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
    }

    const member = await db.teamMember.create({
      data: {
        teamId,
        userId: invitee.id,
        role: "member",
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Team invite error:", error);
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}
