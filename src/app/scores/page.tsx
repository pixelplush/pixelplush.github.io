'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/i18n';

const STATS_URL = 'https://stats.pixelplush.dev/v1';

const gameThemeNames: Record<string, string> = {
  pixelparachuteall: '',
  pixelparachutespring: 'Pixel Parachute (Spring Blossoms)',
  pixelparachuteeaster: 'Pixel Parachute (Easter)',
  pixelparachuteday: 'Pixel Parachute (Day)',
  pixelparachutenight: 'Pixel Parachute (Night)',
  pixelparachuteretro: 'Pixel Parachute (Retro)',
  pixelparachutepoolred: 'Pixel Parachute (Pool Party, Red)',
  pixelparachutepoolblue: 'Pixel Parachute (Pool Party, Blue)',
  pixelparachuteautumn: 'Pixel Parachute (Autumn)',
  pixelparachutehalloween: 'Pixel Parachute (Halloween)',
  pixelparachutechristmas: 'Pixel Parachute (Christmas)',
  pixelparachutewinter: 'Pixel Parachute (Winter)',
};

interface Score {
  rank?: number;
  score: number;
  user: string;
  userId: string;
  created: string;
}

function ScoresContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [channel, setChannel] = useState(searchParams.get('channel') || '');
  const [timeRange, setTimeRange] = useState(searchParams.get('time') || '1m');
  const [theme, setTheme] = useState(searchParams.get('theme') || 'pixelparachuteall');
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const fetchScores = useCallback(async () => {
    if (!channel) return;
    setLoading(true);
    try {
      const date = new Date();
      switch (timeRange) {
        case '12h':
          date.setTime(date.getTime() - 12 * 60 * 60 * 1000);
          break;
        case '1w':
          date.setTime(date.getTime() - (date.getDay() * 24 + date.getHours()) * 60 * 60 * 1000);
          break;
        case '1m':
        default:
          date.setDate(1);
          date.setHours(0, 0, 0, 0);
          break;
      }
      const daystamp = date.toISOString().split('T')[0];
      const themeName = gameThemeNames[theme];
      const themeParam = themeName ? `&theme=${encodeURIComponent(themeName)}` : '';
      const url = `${STATS_URL}/scores/high?channel=${encodeURIComponent(channel)}&game=parachute${themeParam}&date=${daystamp}`;
      const data: Score[] = await fetch(url).then((r) => r.json());
      setScores(data);
    } catch {
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, [channel, timeRange, theme]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (channel) params.set('channel', channel);
    params.set('time', timeRange);
    params.set('game', 'parachute');
    params.set('theme', theme);
    setShareUrl(`${typeof window !== 'undefined' ? window.location.origin : ''}/scores?${params.toString()}`);
  }, [channel, timeRange, theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (channel) fetchScores();
    }, 500);
    return () => clearTimeout(timer);
  }, [channel, fetchScores]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">{t("scores.title")}</h1>
      <p className="mb-8 text-[var(--color-pp-text-muted)]">{t("scores.subtitle")}</p>

      {/* Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]">{t("scores.channel")}</label>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value.toLowerCase())}
            placeholder={t("scores.channelPlaceholder")}
            className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2.5 text-[var(--color-pp-headings)] placeholder-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]">{t("scores.timeRange")}</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2.5 text-[var(--color-pp-headings)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          >
            <option value="12h">{t("scores.last12h")}</option>
            <option value="1w">{t("scores.thisWeek")}</option>
            <option value="1m">{t("scores.thisMonth")}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]">{t("scores.theme")}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2.5 text-[var(--color-pp-headings)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          >
            {Object.entries(gameThemeNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name || t('scores.allThemes')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Share Link */}
      {channel && (
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-[var(--color-pp-text-muted)]">{t("scores.shareLink")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2 text-sm text-[var(--color-pp-text)]"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="rounded-lg border border-[var(--color-pp-border)] px-4 py-2 text-sm text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-card)]"
            >
              {t("scores.copy")}
            </button>
          </div>
        </div>
      )}

      {/* Scores Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)]">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
          </div>
        ) : !channel ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            {t("scores.enterChannel")}
          </div>
        ) : scores.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            {t("scores.noScores")}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-pp-border)] bg-[var(--color-pp-card)] text-sm text-[var(--color-pp-text-muted)]">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">{t("scores.player")}</th>
                <th className="px-4 py-3 font-medium text-right">{t("scores.score")}</th>
                <th className="hidden px-4 py-3 font-medium text-right sm:table-cell">{t("scores.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scores.slice(0, 100).map((score, i) => (
                <tr key={`${score.userId}-${i}`} className="transition hover:bg-[var(--color-pp-card)]">
                  <td className="px-4 py-3 text-[var(--color-pp-text-muted)]">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-pp-headings)]">{score.user}</td>
                  <td className="px-4 py-3 text-right font-mono text-[var(--color-pp-accent)]">{score.score.toLocaleString()}</td>
                  <td className="hidden px-4 py-3 text-right text-sm text-[var(--color-pp-text-muted)] sm:table-cell">
                    {new Date(score.created).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function ScoresPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" /></div>}>
      <ScoresContent />
    </Suspense>
  );
}
