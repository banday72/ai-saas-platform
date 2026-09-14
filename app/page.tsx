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
  },
  {
    icon: Check,
    title: "SEO Optimized",
    description:
      "Built-in keyword optimization to help your content rank higher.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Create high-quality content fast with our powerful AI engine.",
  },
  {
    icon: Mail,
    title: "Email Campaigns",
    description:
      "Craft high-converting email copy and subject lines effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track your generations and credit usage from one dashboard.",
  },
  {
    icon: Sparkles,
    title: "Agency Ready",
    description:
      "Built for marketing agencies managing content for multiple clients.",
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
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="font-bold text-xl">AI SaaS</span>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-slate-300 hover:text-white text-sm">
              Features
            </a>
            <a href="#pricing" className="text-slate-300 hover:text-white text-sm">
              Pricing
            </a>
            <Link href="/sign-in" className="text-slate-300 hover:text-white text-sm">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/40 bg-amber-600/10 px-4 py-1 text-sm text-amber-400 mb-6">
          <Sparkles className="h-4 w-4" />
          AI-Powered Content Generation
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Content Generation
          <span className="block text-amber-500">for Agencies</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Create high-quality blog posts, social media content, emails, and ad
          copy in seconds. Save hours every week for your agency.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="#pricing"
            className="px-8 py-4 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 text-lg"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need to Create Great Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`bg-slate-900 border rounded-lg p-8 flex flex-col ${
                plan.popular
                  ? "border-amber-500"
                  : "border-slate-800"
              }`}
            >
              {plan.popular && (
                <span className="self-start rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2">
                {plan.price}
                <span className="text-sm text-slate-400 font-normal">
                  /month
                </span>
              </p>
              <p className="text-sm text-amber-400 mt-1">{plan.credits}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <Check className="h-4 w-4 text-green-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 px-6 py-3 rounded-lg font-bold text-center transition ${
                  plan.popular
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "border border-slate-700 text-white hover:bg-slate-800"
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
        <h2 className="text-4xl font-bold mb-4">
          Ready to Save Hours Every Week?
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Join agencies already using AI SaaS to create better content faster.
        </p>
        <Link
          href="/sign-up"
          className="inline-block px-8 py-4 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 text-lg"
        >
          Start Free Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">© 2026 AI SaaS. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-slate-400">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
