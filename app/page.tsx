import Link from "next/link";
import {
  PenLine,
  Check,
  Sparkles,
  Zap,
  BarChart3,
  Mail,
  ArrowRight,
  Star,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "AI Content Writer",
    description:
      "Generate blog posts, social media content, emails, and ad copy in seconds.",
  },
  {
    icon: Check,
    title: "SEO Optimized",
    description:
      "Built-in keyword optimization to help your content rank higher on search engines.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Create high-quality content fast with our powerful AI engine powered by GPT-4.",
  },
  {
    icon: Mail,
    title: "Email Campaigns",
    description:
      "Craft high-converting email copy and subject lines that drive results.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track your generations, credit usage, and content performance from one dashboard.",
  },
  {
    icon: Globe,
    title: "API Access",
    description:
      "Integrate AI content generation directly into your workflow with our REST API.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    credits: "10 credits / month",
    features: ["10 credits / month", "Blog & social posts", "Basic support"],
    cta: "Get Started Free",
    href: "/sign-up",
  },
  {
    name: "Professional",
    price: "$19",
    credits: "100 credits / month",
    features: [
      "100 credits / month",
      "All 7 content types",
      "SEO optimization",
      "Priority support",
      "Content history",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    credits: "500 credits / month",
    features: [
      "500 credits / month",
      "Everything in Pro",
      "Agency accounts",
      "REST API access",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director, TechFlow",
    avatar: "SC",
    content:
      "ContentForge has cut our content production time by 70%. The quality of AI-generated blog posts is genuinely impressive.",
  },
  {
    name: "Marcus Rivera",
    role: "Agency Owner, GrowthLab",
    avatar: "MR",
    content:
      "We manage content for 15+ clients. ContentForge lets us scale without hiring more writers. The API integration is seamless.",
  },
  {
    name: "Emily Watson",
    role: "Freelance Copywriter",
    avatar: "EW",
    content:
      "I use ContentForge for first drafts and ideation. It gives me a solid starting point that I can refine. My clients love the turnaround speed.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-sm text-white">ContentForge</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <a
              href="#features"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex px-3 py-1.5 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.12),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Trusted by 2,000+ agencies worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              AI-Powered Content
              <br />
              <span className="text-amber-500">for Modern Agencies</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Generate blog posts, social media content, emails, and ad copy in
              seconds. Scale your content production without scaling your team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm"
              >
                Start Free — No Card Required
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800/60 hover:text-white transition-colors text-sm"
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1 overflow-hidden shadow-2xl shadow-black/50">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=675&fit=crop&crop=center"
                  alt="Content creation dashboard"
                  className="w-full h-auto object-cover opacity-90"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-zinc-800/80 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-6">
            Trusted by teams at
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-16 opacity-40 grayscale">
            {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((name) => (
              <span
                key={name}
                className="text-lg sm:text-xl font-bold text-zinc-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs text-amber-500 font-medium uppercase tracking-widest mb-2">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Everything you need to scale content
            </h2>
            <p className="text-zinc-400 text-lg">
              Powerful AI tools designed for marketing agencies and content teams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-4 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-colors">
                    <Icon className="h-5 w-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshot section */}
      <section className="py-20 sm:py-28 border-y border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs text-amber-500 font-medium uppercase tracking-widest mb-2">
                AI Writer
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Generate any type of content
              </h2>
              <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                Choose from 7 content types, customize the tone, and get
                publication-ready content in seconds. Each generation costs just
                1 credit.
              </p>
              <ul className="space-y-3">
                {[
                  "Blog posts with proper structure and headings",
                  "Social media posts with hashtags",
                  "Email campaigns that convert",
                  "Ad copy optimized for clicks",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-amber-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&crop=center"
                alt="AI content generation interface"
                className="w-full h-auto object-cover opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs text-amber-500 font-medium uppercase tracking-widest mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Loved by content teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-400">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-20 sm:py-28 border-t border-zinc-800/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs text-amber-500 font-medium uppercase tracking-widest mb-2">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-xl border ${
                  plan.popular
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500 text-black rounded-full">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-medium text-zinc-400 mb-1">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">/month</span>
                </div>
                <p className="text-xs text-amber-500 font-medium mb-5">
                  {plan.credits}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Start creating better content today
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Join 2,000+ agencies using ContentForge to produce high-quality
            content at scale.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm"
          >
            Start Free — No Card Required
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-[10px]">C</span>
            </div>
            <span className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} ContentForge AI. All rights
              reserved.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-500">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">
              Terms
            </span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
