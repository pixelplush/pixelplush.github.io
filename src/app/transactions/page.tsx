'use client';

import { useAuth } from '@/lib/auth';

export default function TransactionsPage() {
  const { isLoggedIn, isLoading, account, login } = useAuth();

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
          <h1 className="mb-3 text-2xl font-bold text-white">Transactions</h1>
          <p className="mb-6 text-slate-400">Log in to view your transaction history.</p>
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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">Transactions</h1>
      <p className="mb-8 text-slate-400">Your purchase and coin transaction history.</p>

      <div className="rounded-2xl border border-white/10 bg-[var(--color-pp-card)] p-6">
        <div className="flex h-48 items-center justify-center text-center">
          <div className="text-slate-500">
            <svg className="mx-auto mb-3 h-12 w-12 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm">Transaction history will appear here.</p>
            <p className="mt-1 text-xs text-slate-600">Full transaction log is being ported from the legacy site.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
