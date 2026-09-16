"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Users, Plus, Mail, Crown } from "lucide-react";

interface TeamMemberUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface TeamMember {
  id: string;
  role: string;
  user: TeamMemberUser;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
}

export function TeamClient({
  ownedTeams,
}: {
  ownedTeams: Team[];
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTeamId, setInviteTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName }),
      });
      const data = await res.json();
      if (res.ok) {
        setTeamName("");
        setShowCreate(false);
        setSuccess("Team created");
        router.refresh();
      } else {
        setError(data.error || "Failed to create team");
      }
    } catch {
      setError("Failed to create team");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: inviteTeamId, email: inviteEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteEmail("");
        setSuccess("Member invited");
        router.refresh();
      } else {
        setError(data.error || "Failed to invite");
      }
    } catch {
      setError("Failed to invite member");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team</h2>
          <p className="text-sm text-zinc-400 mt-0.5">Manage your agency team</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {showCreate && (
        <Card>
          <CardContent className="pt-5">
            <form onSubmit={handleCreateTeam} className="flex gap-2">
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
                required
                className="flex-1"
              />
              <Button type="submit" loading={loading} size="sm">
                Create
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreate(false)}
                size="sm"
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {ownedTeams.length === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-center">
          <Users className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">No teams yet</p>
        </div>
      ) : (
        ownedTeams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>
                    {team.members.length} member
                    {team.members.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-xs font-medium text-zinc-400">
                        {member.user.name?.[0] ||
                          member.user.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {member.user.name || member.user.email}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        member.role === "owner"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}

                <div className="pt-2">
                  <Label>Invite Member</Label>
                  <form onSubmit={handleInvite} className="flex gap-2 mt-1">
                    <Input
                      type="email"
                      value={inviteTeamId === team.id ? inviteEmail : ""}
                      onFocus={() => setInviteTeamId(team.id)}
                      onChange={(e) => {
                        setInviteTeamId(team.id);
                        setInviteEmail(e.target.value);
                      }}
                      placeholder="email@example.com"
                      className="flex-1"
                    />
                    <Button type="submit" loading={loading} size="sm">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
