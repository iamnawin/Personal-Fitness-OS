"use client";

import Link from "next/link";
import { BrandMark } from "@/components/fitness/BrandMark";
import { brand } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
      <BrandMark size="lg" />
      <p className="text-lg text-white/70">{brand.tagline}</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/coach"
          className="rounded-xl bg-brand-accent px-6 py-3 text-center font-semibold text-white transition-transform hover:scale-105"
        >
          Start My Plan
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/20 px-6 py-3 text-center font-medium text-white/80 transition-colors hover:border-brand-electric"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
