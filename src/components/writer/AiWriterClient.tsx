"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@/src/components/ui";
import { Alert } from "@/src/components/ui/Alert";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { Copy, Check, Zap } from "lucide-react";

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

const TYPE_GRADIENTS: Record<ContentType, string> = {
  blog: "from-amber-500 to-orange-600",
  social: "from-blue-500 to-indigo-600",
  email: "from-emerald-500 to-green-600",
  ad: "from-rose-500 to-pink-600",
  website: "from-violet-500 to-purple-600",
  product: "from-cyan-500 to-teal-600",
  seo: "from-fuchsia-500 to-purple-600",
};

interface Template {
  id: string;
  name: string;
  type: string;
  prompt: string;
}

export function AiWriterClient({
  creditsLeft,
  history,
}: {
  creditsLeft: number;
  history: { id: string; title: string; type: string; createdAt: Date }[];
}) {
  const searchParams = useSearchParams();
  const [type, setType] = useState<ContentType>(
    (searchParams.get("type") as ContentType) || "blog"
  );
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ content: string; title: string; id: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const templateId = searchParams.get("templateId");
    if (templateId && templates.length > 0) {
      const tpl = templates.find((t) => t.id === templateId);
      if (tpl) {
        setType(tpl.type as ContentType);
        setPrompt(tpl.prompt);
        setSelectedTemplate(tpl.id);
      }
    }
  }, [searchParams, templates]);

  function handleTemplateSelect(templateId: string) {
    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) {
      setType(tpl.type as ContentType);
      setPrompt(tpl.prompt);
      setSelectedTemplate(templateId);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const combinedPrompt = tone
        ? `${prompt}\n\nTone: ${tone}`
        : prompt;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt: combinedPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult({ content: data.content, title: data.title, id: data.id });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Writer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate high-quality content for your clients in seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            1 credit per generation
          </span>
          <span className="rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1 text-sm font-medium text-amber-400">
            {creditsLeft} credits left
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Content</CardTitle>
            <CardDescription>
              Select a content type and describe what you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {templates.length > 0 && (
                <div>
                  <Label>Use Template (optional)</Label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none transition-all"
                  >
                    <option value="">No template</option>
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({TYPES[tpl.type as ContentType] ?? tpl.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(TYPES) as ContentType[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        type === key
                          ? `bg-gradient-to-r ${TYPE_GRADIENTS[key]} border-transparent text-white shadow-lg`
                          : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {TYPES[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Topic / Description</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder="e.g. 10 tips for growing a digital marketing agency in 2025"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tone">Tone (optional)</Label>
                <Input
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. professional, friendly, persuasive"
                />
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {creditsLeft < 1 && (
                <Alert variant="warning">
                  You have no credits left.{" "}
                  <a href="/billing" className="underline font-medium">Upgrade your plan</a>
                </Alert>
              )}

              <Button type="submit" loading={loading} disabled={creditsLeft < 1} className="w-full">
                {loading ? "Generating..." : "Generate Content (1 credit)"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              Your generated content will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <LoadingSpinner className="h-8 w-8 mb-3" />
                <p className="text-sm">Generating your content...</p>
              </div>
            ) : result ? (
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-white">{result.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={handleCopy}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 transition-all"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <a
                      href={`/content/${result.id}`}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 transition-all"
                    >
                      View
                    </a>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 rounded-xl p-4 max-h-[480px] overflow-y-auto" style={{ background: "rgba(0,0,0,0.3)" }}>
                  {result.content}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <p className="text-sm">
                  No content generated yet. Fill in the form and click generate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/5">
              {history.slice(0, 5).map((item) => (
                <a
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="flex items-center justify-between py-3 hover:bg-white/5 -mx-6 px-6 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {TYPES[item.type as ContentType] ?? item.type} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
