"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Label } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { Copy, Check, ArrowLeft, Download, Folder, Tag, Trash2, Sparkles } from "lucide-react";

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

interface FolderType { id: string; name: string; color: string | null; }
interface TagType { id: string; name: string; color: string | null; }

export function ContentDetailClient({
  generation,
  folders,
  tags,
  creditsLeft,
}: {
  generation: Generation;
  folders: FolderType[];
  tags: TagType[];
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
    window.open(
      `/api/content/export?id=${generation.id}&format=${format}`,
      "_blank"
    );
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: generation.type,
          prompt: generation.prompt,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/content/${data.id}`);
        router.refresh();
      } else {
        setError(data.error || "Failed to regenerate");
      }
    } catch {
      setError("Failed to regenerate");
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
        body: JSON.stringify({
          folderId: folderId || null,
          tagIds: selectedTags,
        }),
      });
      if (res.ok) router.refresh();
    } catch {
      // silent
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this content?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/${generation.id}`, {
        method: "DELETE",
      });
      if (res.ok) router.push("/history");
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/history">
          <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white tracking-tight truncate">
            {generation.title}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {TYPES[generation.type] ?? generation.type} ·{" "}
            {new Date(generation.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => handleExport("txt")}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            TXT
          </button>
          <button
            onClick={() => handleExport("md")}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            MD
          </button>
          <button
            onClick={() => handleExport("html")}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            HTML
          </button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 bg-zinc-950 rounded-lg p-4 max-h-[500px] overflow-y-auto border border-zinc-800/50">
                {generation.content}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">{generation.prompt}</p>
            </CardContent>
          </Card>

          <Button
            onClick={handleRegenerate}
            loading={regenerating}
            disabled={creditsLeft < 1}
          >
            <Sparkles className="h-4 w-4" />
            Regenerate
          </Button>
        </div>

        <div className="space-y-4">
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
                className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
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
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-zinc-600">No tags created</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveMeta}
            loading={savingMeta}
            variant="secondary"
            className="w-full"
            size="sm"
          >
            Save Organization
          </Button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
