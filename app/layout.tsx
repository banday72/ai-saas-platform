import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/src/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ContentForge AI — AI Content Platform for Agencies",
    template: "%s — ContentForge AI",
  },
  description:
    "Generate high-quality blog posts, social media content, emails, and ad copy with AI. Built for marketing agencies.",
  openGraph: {
    title: "ContentForge AI — AI Content Platform for Agencies",
    description:
      "Generate high-quality blog posts, social media content, emails, and ad copy with AI.",
    type: "website",
    siteName: "ContentForge AI",
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
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
