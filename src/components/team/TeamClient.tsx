"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Users, Plus, Mail, Crown } from "lucide-react";

interface TeamMemberUser {
  id: string;
  name: string | null;
  email: string;
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
  memberships,
  ownedTeams,
  currentPlan,
}: {
  memberships: { team: Team }[];
  ownedTeams: Team[];
  currentPlan: string;
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTeamId, setInviteTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allTeams = ownedTeams;

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
        setSuccess("Team created successfully");
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
        setSuccess("Member invited successfully");
        router.refresh();
      } else {
        setError(data.error || "Failed to invite member");
      }
    } catch {
      setError("Failed to invite member");
    } finally {
      setLoading(false);
    }
  }

  if (currentPlan === "free") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your agency team</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Team Features</h3>
            <p className="text-slate-400 mb-4">
              Upgrade to Pro or Business to create teams and collaborate with your agency.
            </p>
            <a href="/billing">
              <Button>Upgrade Plan</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your agency team</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="flex gap-3">
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
                required
                className="flex-1"
              />
              <Button type="submit" loading={loading}>Create</Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {allTeams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No teams yet. Create one to start collaborating.</p>
          </CardContent>
        </Card>
      ) : (
        allTeams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>{team.members.length} member{team.members.length !== 1 ? "s" : ""}</CardDescription>
                </div>
                {team.ownerId && (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Owner
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
                          {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{member.user.name || member.user.email}</p>
                          <p className="text-xs text-slate-500">{member.user.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.role === "owner"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-700 text-slate-300"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>

                {team.ownerId && (
                  <div>
                    <Label>Invite Member</Label>
                    <form onSubmit={handleInvite} className="flex gap-2 mt-1">
                      <input type="hidden" value={team.id} onChange={() => setInviteTeamId(team.id)} />
                      <Input
                        type="email"
                        value={inviteTeamId === team.id ? inviteEmail : ""}
                        onChange={(e) => { setInviteTeamId(team.id); setInviteEmail(e.target.value); }}
                        placeholder="colleague@email.com"
                        className="flex-1"
                      />
                      <Button type="submit" loading={loading} size="sm">
                        <Mail className="h-4 w-4" />
                        Invite
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
