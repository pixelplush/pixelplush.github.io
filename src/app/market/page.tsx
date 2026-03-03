import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goodies Market",
  description: "Buy characters, pets, and outfits for PixelPlush games with Plush Coins.",
};

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Goodies Market</h1>
      <p className="mt-4 text-slate-400">
        Get characters, pets, and outfits for PixelPlush games. Coming soon...
      </p>
    </div>
  );
}
