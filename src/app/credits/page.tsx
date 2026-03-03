import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits",
  description: "PixelPlush credits and acknowledgements.",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Credits</h1>
      <p className="mt-4 text-slate-400">Coming soon...</p>
    </div>
  );
}
