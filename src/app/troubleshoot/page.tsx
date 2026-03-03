import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troubleshoot",
  description: "Diagnose and fix common PixelPlush connection issues.",
};

export default function TroubleshootPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Troubleshoot</h1>
      <p className="mt-4 text-slate-400">
        Diagnose and fix common connection issues. Coming soon...
      </p>
    </div>
  );
}
