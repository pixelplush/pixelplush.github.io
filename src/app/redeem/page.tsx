import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem Code",
  description: "Redeem a PixelPlush code for coins or items.",
};

export default function RedeemPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Redeem Code</h1>
      <p className="mt-4 text-slate-400">
        Enter a code to redeem coins or items. Coming soon...
      </p>
    </div>
  );
}
