import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/src/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI SaaS - Content Generation for Agencies",
    template: "%s | AI SaaS",
  },
  description: "Powerful AI tools for digital marketing agencies. Generate blog posts, social media content, emails, and ad copy in seconds.",
  keywords: ["AI", "content generation", "marketing", "agency", "blog", "social media", "copywriting"],
  openGraph: {
    title: "AI SaaS - Content Generation for Agencies",
    description: "Powerful AI tools for digital marketing agencies",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
