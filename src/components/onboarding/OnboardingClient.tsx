"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { Check, ArrowRight, Sparkles, CreditCard, Users, FileText, BarChart3 } from "lucide-react";

const STEPS = [
  {
    id: "welcome",
    title: "Welcome to AI SaaS",
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
    description: "Start with 10 free credits or upgrade for more.",
    icon: CreditCard,
    action: "View Plans",
    href: "/billing",
  },
  {
    id: "analytics",
    title: "Track Your Usage",
    description: "Monitor your generations and credit usage from the analytics dashboard.",
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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {userName}!
          </h1>
          <p className="text-slate-400">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-600/20 flex items-center justify-center mx-auto">
                <Icon className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
              <p className="text-slate-400">{step.description}</p>

              {completedSteps.includes(step.id) && (
                <span className="inline-flex items-center gap-1 text-sm text-green-400">
                  <Check className="h-4 w-4" /> Completed
                </span>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <Button variant="ghost" onClick={handleSkip}>
                Skip All
              </Button>
              {step.href && (
                <Button
                  variant="secondary"
                  onClick={() => router.push(step.href!)}
                >
                  {step.action}
                </Button>
              )}
              <Button onClick={handleNext} loading={loading}>
                {currentStep < STEPS.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === currentStep
                  ? "bg-amber-500"
                  : completedSteps.includes(s.id)
                  ? "bg-green-500"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
