"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Trash2, Plus, Edit } from "lucide-react";

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
    try {
      await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      // silent
    }
  }

  async function handleUseTemplate(template: Template) {
    const params = new URLSearchParams({
      type: template.type,
      templateId: template.id,
    });
    router.push(`/ai-writer?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-slate-400 text-sm mt-1">
            Save and reuse your best prompts
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Template" : "New Template"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tpl-name">Name</Label>
                  <Input
                    id="tpl-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Weekly Newsletter"
                    required
                  />
                </div>
                <div>
                  <Label>Content Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(TYPES) as ContentType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setType(key)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                          type === key
                            ? "bg-amber-600 border-amber-600 text-white"
                            : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {TYPES[key]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="tpl-desc">Description (optional)</Label>
                <Input
                  id="tpl-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>
              <div>
                <Label htmlFor="tpl-prompt">Prompt Template</Label>
                <Textarea
                  id="tpl-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder="Write your prompt template here..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" loading={loading}>
                  {editingId ? "Update Template" : "Create Template"}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 mb-4">No templates yet. Create one to save your best prompts.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="hover:border-slate-600 transition">
              <CardHeader>
                <CardTitle className="text-base">{tpl.name}</CardTitle>
                <CardDescription>
                  {TYPES[tpl.type as ContentType] ?? tpl.type}
                  {tpl.description && ` · ${tpl.description}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4">{tpl.prompt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Used {tpl.usageCount} times</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleUseTemplate(tpl)}>
                      Use
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(tpl)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(tpl.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
