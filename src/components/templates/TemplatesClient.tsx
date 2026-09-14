"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Plus, Edit, Trash2, FileText, ArrowRight } from "lucide-react";

const TYPES = {
  blog: "Blog Post",
  social: "Social Media",
  email: "Email",
  ad: "Ad Copy",
  website: "Website Copy",
  product: "Product Description",
  seo: "SEO Content",
} as const;

type ContentType = keyof typeof TYPES;

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  prompt: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
}

export function TemplatesClient({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ContentType>("blog");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setDescription("");
    setType("blog");
    setPrompt("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(template: Template) {
    setName(template.name);
    setDescription(template.description || "");
    setType(template.type as ContentType);
    setPrompt(template.prompt);
    setEditingId(template.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editingId ? `/api/templates?id=${editingId}` : "/api/templates";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type, prompt }),
      });
      if (res.ok) {
        resetForm();
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save template");
      }
    } catch {
      setError("Failed to save template");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Templates
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Save and reuse your best prompts
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "New"} Template</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Weekly Newsletter"
                    required
                  />
                </div>
                <div>
                  <Label>Content Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ContentType)}
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {Object.entries(TYPES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label>Prompt</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Write your prompt template..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" loading={loading} size="sm">
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm} size="sm">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 && !showForm ? (
        <div className="p-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-400 mb-3">No templates yet</p>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {TYPES[tpl.type as ContentType] ?? tpl.type}
                  </p>
                </div>
              </div>
              {tpl.description && (
                <p className="text-xs text-zinc-500 mb-2 line-clamp-2">
                  {tpl.description}
                </p>
              )}
              <p className="text-xs text-zinc-600 line-clamp-2 mb-3 font-mono">
                {tpl.prompt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">
                  Used {tpl.usageCount}x
                </span>
                <div className="flex gap-1">
                  <a href={`/ai-writer?templateId=${tpl.id}`}>
                    <button className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-500 hover:bg-zinc-800 transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </a>
                  <button
                    onClick={() => startEdit(tpl)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
