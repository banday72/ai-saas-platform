import Link from "next/link";
import {
  PenLine,
  Check,
  Sparkles,
  Zap,
  BarChart3,
  Mail,
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "AI Content Writer",
    description:
      "Generate blog posts, social media, emails, and ad copy in seconds.",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Check,
    title: "SEO Optimized",
    description:
      "Built-in keyword optimization to help your content rank higher.",
    gradient: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Create high-quality content fast with our powerful AI engine.",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: Mail,
    title: "Email Campaigns",
    description:
      "Craft high-converting email copy and subject lines effortlessly.",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track your generations and credit usage from one dashboard.",
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    icon: Sparkles,
    title: "Agency Ready",
    description:
      "Built for marketing agencies managing content for multiple clients.",
    gradient: "from-teal-500 to-cyan-600",
    shadow: "shadow-teal-500/20",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    credits: "10 credits/month",
    features: ["10 credits / month", "Blog & social posts", "Basic support"],
    cta: "Get Started",
    href: "/sign-up",
    gradient: "from-slate-700 to-slate-800",
    border: "border-white/10",
    iconBg: "from-slate-500 to-slate-600",
  },
  {
    name: "Pro",
    price: "$19",
    credits: "100 credits/month",
    features: [
      "100 credits / month",
      "All content types",
      "SEO optimization",
      "Priority support",
    ],
    cta: "Start 1 Month",
    href: "/sign-up",
    popular: true,
    gradient: "from-amber-500 to-orange-600",
    border: "border-amber-500/50",
    iconBg: "from-amber-500 to-orange-600",
  },
  {
    name: "Business",
    price: "$49",
    credits: "500 credits/month",
    features: [
      "500 credits / month",
      "Everything in Pro",
      "Agency accounts",
      "API access",
    ],
    cta: "Start 1 Month",
    href: "/sign-up",
    gradient: "from-violet-500 to-purple-600",
    border: "border-violet-500/50",
    iconBg: "from-violet-500 to-purple-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      {/* Nav */}
      <header className="border-b border-white/5" style={{ background: "rgba(10,10,26,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-xl text-white">AI SaaS</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">
              Pricing
            </a>
            <Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition-colors">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/20"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-1.5 text-sm text-amber-400 mb-8">
            <Sparkles className="h-4 w-4" />
            AI-Powered Content Generation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Content Generation</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              for Agencies
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Create high-quality blog posts, social media content, emails, and ad
            copy in seconds. Save hours every week for your agency.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 text-lg transition-all shadow-xl shadow-amber-500/20"
            >
              Get Started Free
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 text-lg transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Everything You Need
          </span>
        </h2>
        <p className="text-center text-slate-500 mb-12">Powerful tools to create great content</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300 group"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Simple Pricing
          </span>
        </h2>
        <p className="text-center text-slate-500 mb-12">Choose the plan that works for you</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border ${plan.border} p-8 flex flex-col relative overflow-hidden`}
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              )}
              {plan.popular && (
                <span className="self-start rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white mb-4 shadow-lg shadow-amber-500/20">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {plan.price}
                <span className="text-sm text-slate-500 font-normal">
                  /month
                </span>
              </p>
              <p className="text-sm bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mt-1 font-medium">{plan.credits}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 px-6 py-3 rounded-xl font-bold text-center transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(6,182,212,0.15) 100%)" }}>
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Save Hours Every Week?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join agencies already using AI SaaS to create better content faster.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 text-lg transition-all shadow-xl shadow-amber-500/20"
            >
              Start Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8" style={{ background: "rgba(10,10,26,0.9)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">&copy; 2026 AI SaaS. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
