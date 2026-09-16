"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, Input } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Search, Trash2, Eye, X, FolderOpen } from "lucide-react";

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
  creditsUsed: number;
  createdAt: Date;
  folder?: { id: string; name: string; color: string | null } | null;
  tags?: { id: string; name: string; color: string | null }[];
}

export function HistoryClient({
  generations,
  totalPages,
  currentPage,
  total,
  filters,
}: {
  generations: Generation[];
  totalPages: number;
  currentPage: number;
  total: number;
  filters: { search: string; type: string; folderId: string; tagId: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search);
  const [type, setType] = useState(filters.type);
  const [folderId, setFolderId] = useState(filters.folderId);
  const [tagId, setTagId] = useState(filters.tagId);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (folderId) params.set("folder", folderId);
    if (tagId) params.set("tag", tagId);
    params.set("page", "1");
    router.push(`/history?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setType("");
    setFolderId("");
    setTagId("");
    router.push("/history");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this content?")) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Failed to delete content");
      }
    } catch {
      setError("Failed to delete content");
    } finally {
      setDeleting(null);
    }
  }

  const hasFilters = search || type || folderId || tagId;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Content History
        </h2>
        <p className="text-sm text-zinc-400 mt-0.5">
          {total} generation{total !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="pl-9"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">All Types</option>
              {Object.entries(TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div className="flex gap-1.5">
              <Button onClick={applyFilters} size="md">
                Filter
              </Button>
              {hasFilters && (
                <Button variant="ghost" onClick={clearFilters} size="md">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* List */}
      {generations.length === 0 ? (
        <div className="p-12 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-6 w-6 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-400">
            No content found.
            {hasFilters ? " Try adjusting your filters." : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/content/${gen.id}`}
                    className="text-sm font-medium text-white hover:text-amber-500 truncate transition-colors"
                  >
                    {gen.title}
                  </Link>
                  {gen.folder && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      {gen.folder.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                  <span>{TYPES[gen.type] ?? gen.type}</span>
                  <span>·</span>
                  <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{gen.creditsUsed} credit</span>
                </div>
                {gen.tags && gen.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {gen.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/content/${gen.id}`}>
                  <button className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(gen.id)}
                  disabled={deleting === gen.id}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/history?page=${p}&search=${search}&type=${type}&folder=${folderId}&tag=${tagId}`}
              >
                <button
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "bg-amber-500 text-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
