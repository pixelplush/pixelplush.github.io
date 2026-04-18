'use client';

import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/i18n';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const ADMIN_USERS = ['instafluff', 'maaya'];
const API_URL = 'https://api.pixelplush.dev/v1';
const STATS_URL = 'https://stats.pixelplush.dev/v1';

interface StatsBucket {
  totalSessions: number;
  totalPlayers: number;
  totalViewers: number;
  totalNewAccounts: number;
  totalTransactions: number;
  totalCoinBuy: number;
  totalCoinSpend: number;
  accounts: Record<string, unknown>;
  channels: Record<string, unknown>;
  streams: Record<string, unknown>;
  players: Record<string, unknown>;
}

interface LiveSession {
  channel: string;
  game: string;
  theme?: string;
  players: { username: string }[];
  stream?: Record<string, unknown>;
  createdAt?: string;
}

type StatsPeriod = 'daily' | 'weekly' | 'monthly' | 'alltime';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-4 text-center">
      <div className="text-2xl font-bold text-[var(--color-pp-accent)]">{value}</div>
      <div className="mt-1 text-xs font-medium text-[var(--color-pp-text-muted)]">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-[var(--color-pp-text-muted)] opacity-60">{sub}</div>}
    </div>
  );
}

function HealthDot({ ok }: { ok: boolean | null }) {
  if (ok === null) return <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-500 animate-pulse" />;
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />;
}

export default function AdminPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, account } = useAuth();

  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [statsHealth, setStatsHealth] = useState<boolean | null>(null);
  const [liveChannels, setLiveChannels] = useState<string[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [stats, setStats] = useState<Record<string, StatsBucket> | null>(null);
  const [activePeriod, setActivePeriod] = useState<StatsPeriod>('daily');
  const [dataLoading, setDataLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setDataLoading(true);
    const results = await Promise.allSettled([
      fetch(`${API_URL}/status`).then(r => r.ok),
      fetch(`${STATS_URL}/status`).then(r => r.ok),
      fetch(`${API_URL}/analytics/sessions/live/short`).then(r => r.json()) as Promise<string[]>,
      fetch(`${STATS_URL}/analytics/sessions/live`).then(r => r.json()) as Promise<LiveSession[]>,
      fetch(`${STATS_URL}/analytics/stats`).then(r => r.json()) as Promise<Record<string, StatsBucket>>,
    ]);
    setApiHealth(results[0].status === 'fulfilled' ? results[0].value : false);
    setStatsHealth(results[1].status === 'fulfilled' ? results[1].value : false);
    if (results[2].status === 'fulfilled') setLiveChannels(results[2].value);
    if (results[3].status === 'fulfilled') setLiveSessions(Array.isArray(results[3].value) ? results[3].value : []);
    if (results[4].status === 'fulfilled' && results[4].value && typeof results[4].value === 'object') setStats(results[4].value);
    setDataLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    const admin = isLoggedIn && account?.username && ADMIN_USERS.includes(account.username.toLowerCase());
    if (!admin) return;
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, account, fetchAll]);

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
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">{t("common.accessDenied")}</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">{t("admin.adminOnly")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-pp-accent)] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            {t("common.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  const currentStats = stats?.[activePeriod];
  const periods: { key: StatsPeriod; label: string }[] = [
    { key: 'daily', label: 'Today' },
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
    { key: 'alltime', label: 'All Time' },
  ];

  const gameNames: Record<string, string> = {
    pixelparachute: 'Parachute',
    pixelplinko: 'Plinko',
    pixelconfetti: 'Confetti',
    pixelhillrolling: 'Hill Rolling',
    wanderingwizards: 'Wizards',
    chatflakes: 'ChatFlakes',
    streamweather: 'Weather',
    giveaway: 'Giveaway',
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{t("admin.title")}</h1>
          <p className="mt-1 text-[var(--color-pp-text-muted)]">{t("admin.subtitle")}</p>
          <p className="mt-1 text-xs text-[var(--color-pp-text-muted)]">
            Logged in as <strong>{account?.displayName || account?.username}</strong>
            {lastRefresh && <> &middot; Updated {lastRefresh.toLocaleTimeString()}</>}
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={dataLoading}
          className="mt-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-accent)] hover:text-white disabled:opacity-50"
        >
          {dataLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Server Health */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3">
          <HealthDot ok={apiHealth} />
          <div>
            <div className="text-xs font-medium text-[var(--color-pp-text)]">API Server</div>
            <div className="text-[10px] text-[var(--color-pp-text-muted)]">api.pixelplush.dev</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3">
          <HealthDot ok={statsHealth} />
          <div>
            <div className="text-xs font-medium text-[var(--color-pp-text)]">Stats Server</div>
            <div className="text-[10px] text-[var(--color-pp-text-muted)]">stats.pixelplush.dev</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3">
          <span className="text-lg font-bold text-[var(--color-pp-accent)]">{liveChannels.length}</span>
          <div className="text-xs font-medium text-[var(--color-pp-text)]">Live Streams</div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3">
          <span className="text-lg font-bold text-[var(--color-pp-accent)]">{liveSessions.length}</span>
          <div className="text-xs font-medium text-[var(--color-pp-text)]">Active Sessions</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Platform Statistics
          </h2>
          <div className="flex gap-1">
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePeriod(p.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activePeriod === p.key
                    ? 'bg-[var(--color-pp-accent)] text-white'
                    : 'text-[var(--color-pp-text-muted)] hover:text-[var(--color-pp-text)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {!currentStats ? (
          <div className="py-8 text-center text-sm text-[var(--color-pp-text-muted)]">
            {dataLoading ? 'Loading stats...' : 'No stats data available'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            <StatCard label="Sessions" value={currentStats.totalSessions} />
            <StatCard label="Players" value={currentStats.totalPlayers} sub={`${Object.keys(currentStats.players || {}).length} unique`} />
            <StatCard label="Viewers" value={currentStats.totalViewers} />
            <StatCard label="Unique Channels" value={Object.keys(currentStats.channels || {}).length} />
            <StatCard label="Unique Streams" value={Object.keys(currentStats.streams || {}).length} />
            <StatCard label="New Users" value={currentStats.totalNewAccounts} />
            <StatCard label="Transactions" value={currentStats.totalTransactions} />
            <StatCard label="Coins Bought" value={(currentStats.totalCoinBuy || 0).toLocaleString()} />
            <StatCard label="Coins Spent" value={(currentStats.totalCoinSpend || 0).toLocaleString()} />
            <StatCard label="Accounts Active" value={Object.keys(currentStats.accounts || {}).length} />
          </div>
        )}
      </div>

      {/* Live Sessions Detail */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {/* Live Channels */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="6" />
            </svg>
            Live Now ({liveChannels.length})
          </h2>
          {liveChannels.length === 0 ? (
            <p className="text-sm text-[var(--color-pp-text-muted)]">No channels currently live</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {liveChannels.map(ch => (
                <a
                  key={ch}
                  href={`https://twitch.tv/${ch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-pp-accent)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-pp-accent)] transition hover:bg-[var(--color-pp-accent)]/20"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {ch}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Active Game Sessions */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-5 h-5 mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
            </svg>
            Active Sessions ({liveSessions.length})
          </h2>
          {liveSessions.length === 0 ? (
            <p className="text-sm text-[var(--color-pp-text-muted)]">No active game sessions</p>
          ) : (
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {liveSessions.map((s, i) => (
                <div key={`${s.channel}-${i}`} className="flex items-center justify-between rounded-lg bg-[var(--color-pp-bg)]/50 px-3 py-2 text-xs">
                  <div>
                    <a
                      href={`https://twitch.tv/${s.channel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors"
                    >
                      {s.channel}
                    </a>
                    <span className="ml-1.5 text-[var(--color-pp-text-muted)]">
                      {gameNames[s.game] || s.game}
                    </span>
                  </div>
                  <span className="text-[var(--color-pp-text-muted)]">
                    {s.players?.length || 0} player{(s.players?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Quick Links
          </h2>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a href="https://stats.pixelplush.dev" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                Stats Dashboard &rarr;
              </a>
            </li>
            <li>
              <a href={`${API_URL}/analytics/stats`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                Raw Stats JSON &rarr;
              </a>
            </li>
            <li>
              <a href={`${STATS_URL}/analytics/sessions/live`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                Raw Sessions JSON &rarr;
              </a>
            </li>
            <li>
              <Link href="/status" className="text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors">
                System Status &rarr;
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Site Management
          </h2>
          <p className="text-xs text-[var(--color-pp-text-muted)]">
            More tools coming — catalog management, user lookup, promo codes, etc.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--color-pp-border)] bg-[var(--color-pp-card)]/50 p-5 opacity-60">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-pp-headings)]">
            <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            User Lookup
          </h2>
          <p className="text-xs text-[var(--color-pp-text-muted)]">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
