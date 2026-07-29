"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-white text-6xl font-bold mb-4">AI SaaS Platform</h1>
      <p className="text-gray-300 text-xl mb-8">Content Generation for Agencies</p>
      <button
        onClick={() => router.push("/sign-up")}
        className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
      >
        Get Started
      </button>
    </div>
  );
}