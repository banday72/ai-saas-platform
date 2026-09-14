"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { Search, Trash2, Eye, Filter, X } from "lucide-react";

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

export function HistoryClient({
  generations,
  totalPages,
  currentPage,
  total,
  folders,
  tags,
  filters,
}: {
  generations: Generation[];
  totalPages: number;
  currentPage: number;
  total: number;
  folders: Folder[];
  tags: Tag[];
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
    if (!confirm("Are you sure you want to delete this content?")) return;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content History</h1>
          <p className="text-slate-400 text-sm mt-1">
            {total} total generation{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by title or prompt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="pl-10"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Types</option>
              {Object.entries(TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Folders</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <select
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={applyFilters} size="md">
                <Filter className="h-4 w-4" />
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

      {generations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-400">No content found. {hasFilters ? "Try adjusting your filters." : ""}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <Card key={gen.id} className="hover:border-slate-600 transition">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/content/${gen.id}`}
                        className="font-medium text-white hover:text-amber-400 truncate"
                      >
                        {gen.title}
                      </Link>
                      {gen.folder && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: gen.folder.color || "#f59e0b",
                            color: gen.folder.color || "#f59e0b",
                            backgroundColor: `${gen.folder.color || "#f59e0b"}15`,
                          }}
                        >
                          {gen.folder.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{TYPES[gen.type] ?? gen.type}</span>
                      <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                      <span>{gen.creditsUsed} credit</span>
                    </div>
                    {gen.tags && gen.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {gen.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${tag.color || "#6366f1"}20`,
                              color: tag.color || "#6366f1",
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/content/${gen.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(gen.id)}
                      loading={deleting === gen.id}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/history?page=${p}&search=${search}&type=${type}&folder=${folderId}&tag=${tagId}`}
            >
              <Button
                variant={p === currentPage ? "primary" : "ghost"}
                size="sm"
              >
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
