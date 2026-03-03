import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scoreboard",
  description: "View top scores and leaderboards for PixelPlush games.",
};

export default function ScoresPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Scoreboard</h1>
      <p className="mt-4 text-slate-400">
        View top scores and leaderboards. Coming soon...
      </p>
    </div>
  );
}
