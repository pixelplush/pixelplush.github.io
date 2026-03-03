'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function CustomizePage() {
  const { isLoggedIn, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-[var(--color-pp-card)] p-8">
          <h1 className="mb-3 text-2xl font-bold text-white">Dressing Room</h1>
          <p className="mb-6 text-slate-400">Log in with Twitch to customize your character, equip outfits, and manage your pet.</p>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 rounded-lg bg-[#9146FF] px-6 py-3 font-medium text-white transition hover:bg-[#7c3aed]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
            Log in with Twitch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dressing Room</h1>
          <p className="mt-1 text-slate-400">Customize your character, outfit, and pet.</p>
        </div>
        <Link
          href="/market"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40"
        >
          Visit Market &rarr;
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Character Preview */}
        <div className="rounded-2xl border border-white/10 bg-[var(--color-pp-card)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Preview</h2>
          <div className="flex h-64 items-center justify-center rounded-lg bg-black/20">
            <div className="text-center text-slate-500">
              <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-white/10" />
              <p className="text-sm">Character preview</p>
              <p className="text-xs text-slate-600">Coming soon in the redesign</p>
            </div>
          </div>
        </div>

        {/* Category Tabs + Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-[var(--color-pp-card)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Your Items</h2>

            {/* Category Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
              {['Characters', 'Pets', 'Body', 'Equipment', 'Accessories', 'Outfits', 'Effects'].map((cat) => (
                <button
                  key={cat}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-white/10 text-center">
              <div className="text-slate-500">
                <p className="text-sm">Item selection grid</p>
                <p className="mt-1 text-xs text-slate-600">
                  Full dressing room functionality is being ported from the legacy site.
                  <br />
                  Visit the <Link href="/market" className="text-purple-400 hover:underline">marketplace</Link> to browse available items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
