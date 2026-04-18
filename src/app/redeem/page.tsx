'use client';

import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { useTranslation } from '@/i18n';

const STATS_URL = 'https://stats.pixelplush.dev/v1';

export default function RedeemPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, token, login } = useAuth();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleRedeem() {
    if (!code.trim() || !token) return;
    setStatus('loading');
    try {
      const res = await fetch(`${STATS_URL}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Twitch: token,
        },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setStatus('error');
        setMessage(data.error);
      } else {
        setStatus('success');
        setMessage(data.message || 'Code redeemed successfully!');
        setCode('');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8">
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">{t("redeem.title")}</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">{t("redeem.subtitle")}</p>
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
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Redeem Code</h1>
      <p className="mb-8 text-[var(--color-pp-text-muted)]">Enter a PixelPlush code to redeem coins, items, or other rewards.</p>

      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setStatus('idle');
            }}
            placeholder="ENTER-CODE-HERE"
            className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3 font-mono text-lg tracking-wider text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          />
          <button
            onClick={handleRedeem}
            disabled={!code.trim() || status === 'loading'}
            className="rounded-lg bg-[var(--color-pp-accent)] px-6 py-3 font-medium text-white transition hover:bg-[#4a7de0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Redeem'
            )}
          </button>
        </div>

        {status === 'success' && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
            {message}
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
