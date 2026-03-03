import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping History",
  description: "View your PixelPlush purchase history.",
};

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Shopping History</h1>
      <p className="mt-4 text-slate-400">
        View your purchase history. Coming soon...
      </p>
    </div>
  );
}
