import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status",
  description: "PixelPlush system status and service health.",
};

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">System Status</h1>
      <p className="mt-4 text-slate-400">
        Service health and status. Coming soon...
      </p>
    </div>
  );
}
