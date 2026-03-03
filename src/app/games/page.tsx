import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games for Twitch",
  description: "Browse and configure PixelPlush stream overlay games for your Twitch channel.",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Games for Twitch</h1>
      <p className="mt-4 text-slate-400">
        Configure and add stream overlay games to your Twitch channel. Coming soon...
      </p>
    </div>
  );
}
