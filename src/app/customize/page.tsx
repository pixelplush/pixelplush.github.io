import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dressing Room",
  description: "Customize your PixelPlush character and pet.",
};

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Dressing Room</h1>
      <p className="mt-4 text-slate-400">
        Customize your character and pet. Coming soon...
      </p>
    </div>
  );
}
