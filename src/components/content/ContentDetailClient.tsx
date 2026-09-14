"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { Copy, Check, ArrowLeft, Download, Folder, Tag, Trash2 } from "lucide-react";

const TYPES: Record<string, string> = {
  blog: "Blog Post",
  social: "Social Media",
  email: "Email",
  ad: "Ad Copy",
  website: "Website Copy",
  product: "Product Description",
  seo: "SEO Content",
};

interface Generation {
  id: string;
  title: string;
  type: string;
  prompt: string;
  content: string;
  creditsUsed: number;
  createdAt: Date;
  folder?: { id: string; name: string; color: string | null } | null;
  tags?: { id: string; name: string; color: string | null }[];
}

interface Folder {
  id: string;
  name: string;
  color: string | null;
}

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

export function ContentDetailClient({
  generation,
  folders,
  tags,
  creditsLeft,
}: {
  generation: Generation;
  folders: Folder[];
  tags: Tag[];
  creditsLeft: number;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderId, setFolderId] = useState(generation.folder?.id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    generation.tags?.map((t) => t.id) || []
  );
  const [savingMeta, setSavingMeta] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(generation.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleExport(format: string) {
    window.open(`/api/content/export?id=${generation.id}&format=${format}`, "_blank");
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: generation.type, prompt: generation.prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/content/${data.id}`);
        router.refresh();
      } else {
        setError(data.error || "Failed to regenerate");
      }
    } catch {
      setError("Failed to regenerate content");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleSaveMeta() {
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/content/${generation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: folderId || null, tagIds: selectedTags }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silent
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this content?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/${generation.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/history");
      }
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/history">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{generation.title}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {TYPES[generation.type] ?? generation.type} · Created {new Date(generation.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={() => handleExport("txt")} variant="outline" size="sm">
            <Download className="h-4 w-4" />
            TXT
          </Button>
          <Button onClick={() => handleExport("md")} variant="outline" size="sm">
            <Download className="h-4 w-4" />
            MD
          </Button>
          <Button onClick={() => handleExport("html")} variant="outline" size="sm">
            <Download className="h-4 w-4" />
            HTML
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                {generation.content}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">{generation.prompt}</p>
            </CardContent>
          </Card>

          <Button
            onClick={handleRegenerate}
            loading={regenerating}
            disabled={creditsLeft < 1}
          >
            {regenerating ? "Regenerating..." : "Regenerate Content (1 credit)"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Folder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-3 py-1 rounded-full border transition ${
                      selectedTags.includes(tag.id)
                        ? "border-amber-500 bg-amber-500/20 text-amber-400"
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-xs text-slate-500">No tags created yet</p>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSaveMeta} loading={savingMeta} variant="secondary" className="w-full">
            Save Organization
          </Button>

          <Button onClick={handleDelete} variant="danger" loading={deleting} className="w-full">
            <Trash2 className="h-4 w-4" />
            Delete Content
          </Button>
        </div>
      </div>
    </div>
  );
}
