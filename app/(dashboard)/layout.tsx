import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | ContentForge AI",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <Sidebar>{children}</Sidebar>;
}
