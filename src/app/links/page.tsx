import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Follow PixelPlush",
  description: "Follow PixelPlush on social media and join the community.",
};

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Follow PixelPlush!</h1>
      <p className="mt-4 text-slate-400">
        Social links and community. Coming soon...
      </p>
    </div>
  );
}
