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
import { Copy, Check, ArrowRight, Sparkles } from "lucide-react";

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
  type: string;
  prompt: string;
}

export function AiWriterClient({
  history,
}: {
  history: { id: string; title: string; type: string; createdAt: Date }[];
}) {
  const searchParams = useSearchParams();
  const [type, setType] = useState<ContentType>(
    (searchParams.get("type") as ContentType) || "blog"
  );
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    content: string;
    title: string;
    id: string;
  } | null>(null);
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
      const combinedPrompt = tone ? `${prompt}\n\nTone: ${tone}` : prompt;
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AI Writer
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Generate high-quality content in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Content</CardTitle>
            <CardDescription>
              Select a type and describe what you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {templates.length > 0 && (
                <div>
                  <Label>Template</Label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="">No template</option>
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(Object.keys(TYPES) as ContentType[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        type === key
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
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
                  rows={4}
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

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                {loading ? (
                  "Generating..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Your generated content appears here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <LoadingSpinner className="h-8 w-8 text-zinc-500 mb-3" />
                <p className="text-sm text-zinc-500">Generating content...</p>
              </div>
            ) : result ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-white">
                    {result.title}
                  </h4>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <a
                      href={`/content/${result.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 bg-zinc-950 rounded-lg p-4 max-h-[480px] overflow-y-auto border border-zinc-800/50">
                  {result.content}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500">
                  No content generated yet.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Fill in the form and click generate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-zinc-800/80">
              {history.slice(0, 5).map((item) => (
                <a
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="flex items-center justify-between py-3 -mx-6 px-6 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {TYPES[item.type as ContentType] ?? item.type} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
