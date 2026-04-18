'use client';

import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/i18n';
import Link from 'next/link';

const ADMIN_USERS = ['instafluff', 'maayainsane'];

export default function AdminPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, account } = useAuth();

  const isAdmin =
    isLoggedIn &&
    account?.username &&
    ADMIN_USERS.includes(account.username.toLowerCase());

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8">
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">Access Denied</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">This page is only available to PixelPlush administrators.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-pp-accent)] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{t("admin.title")}</h1>
        <p className="mt-1 text-[var(--color-pp-text-muted)]">{t("admin.subtitle")}</p>
        <p className="mt-2 text-xs text-[var(--color-pp-text-muted)]">
          Logged in as <strong>{account?.displayName || account?.username}</strong>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://stats.pixelplush.dev" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                Stats Dashboard &rarr;
              </a>
            </li>
            <li>
              <a href="https://api.pixelplush.dev/v1" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                API Server &rarr;
              </a>
            </li>
            <li>
              <Link href="/status" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                System Status &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Site Overview */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Site Management
          </h2>
          <p className="text-sm text-[var(--color-pp-text-muted)]">
            More admin tools will be added here as needed — catalog management, user lookup, promo codes, analytics, etc.
          </p>
        </div>

        {/* Placeholder: User Lookup */}
        <div className="rounded-2xl border border-dashed border-[var(--color-pp-border)] bg-[var(--color-pp-card)]/50 p-5 opacity-60">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            User Lookup
          </h2>
          <p className="text-sm text-[var(--color-pp-text-muted)]">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
