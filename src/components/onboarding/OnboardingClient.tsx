"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent } from "@/src/components/ui";
import {
  Check,
  ArrowRight,
  Sparkles,
  CreditCard,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";

const STEPS = [
  {
    id: "welcome",
    title: "Welcome to ContentForge",
    description: "Let's get you set up in just a few steps.",
    icon: Sparkles,
  },
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Make sure your account details are correct.",
    icon: Users,
    action: "Go to Settings",
    href: "/settings",
  },
  {
    id: "first-content",
    title: "Generate Your First Content",
    description: "Try the AI Writer to create blog posts, social media, emails, and more.",
    icon: FileText,
    action: "Open AI Writer",
    href: "/ai-writer",
  },
  {
    id: "billing",
    title: "Choose a Plan",
    description: "Everything is free — start generating content.",
    icon: CreditCard,
    action: "View Plans",
    href: "/billing",
  },
  {
    id: "analytics",
    title: "Track Your Usage",
    description: "Monitor your generations and credit usage from analytics.",
    icon: BarChart3,
    action: "View Analytics",
    href: "/analytics",
  },
];

export function OnboardingClient({
  completedSteps,
  userName,
}: {
  completedSteps: string[];
  userName: string;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  async function completeStep(stepId: string) {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepId }),
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    const step = STEPS[currentStep];
    await completeStep(step.id);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComplete: true }),
      });
      router.push("/dashboard");
    }
  }

  async function handleSkip() {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isComplete: true }),
    });
    router.push("/dashboard");
  }

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {userName}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <div className="mt-3 h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Icon className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">{step.description}</p>
              </div>
              {completedSteps.includes(step.id) && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="h-3.5 w-3.5" /> Completed
                </span>
              )}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="ghost" onClick={handleSkip} size="sm">
                Skip All
              </Button>
              {step.href && (
                <Button
                  variant="secondary"
                  onClick={() => router.push(step.href!)}
                  size="sm"
                >
                  {step.action}
                </Button>
              )}
              <Button onClick={handleNext} loading={loading} size="sm">
                {currentStep < STEPS.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep
                  ? "bg-amber-500"
                  : completedSteps.includes(s.id)
                  ? "bg-emerald-500"
                  : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
