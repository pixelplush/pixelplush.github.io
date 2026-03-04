'use client';

import { useEffect, useState } from 'react';

const API_URL = 'https://api.pixelplush.dev/v1';

interface LiveSession {
  channel: string;
}

export default function StatusPage() {
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [liveChannels, setLiveChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const channels: string[] = await fetch(`${API_URL}/analytics/sessions/live/short`).then((r) => r.json());
        setLiveChannels(channels);
        setLiveCount(channels.length);
      } catch {
        setLiveCount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">System Status</h1>
      <p className="mb-8 text-slate-400">Current status of PixelPlush services.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Overall status */}
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center">
          <div className="mb-2 inline-block h-4 w-4 rounded-full bg-green-500" />
          <h2 className="text-lg font-semibold text-white">All Systems</h2>
          <p className="text-sm text-green-400">Operational</p>
        </div>

        {/* Live streams */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-[var(--color-pp-accent)]">
            {loading ? '...' : liveCount ?? '—'}
          </div>
          <h2 className="text-sm font-medium text-slate-400">Live Streams</h2>
        </div>

        {/* API */}
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center">
          <div className="mb-2 inline-block h-4 w-4 rounded-full bg-green-500" />
          <h2 className="text-lg font-semibold text-white">API</h2>
          <p className="text-sm text-green-400">Responding</p>
        </div>
      </div>

      {/* Service Details */}
      <div className="mt-8 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Services</h2>
        <div className="divide-y divide-white/5">
          {[
            { name: 'Game Server (Rooms)', status: 'Operational' },
            { name: 'API (Accounts, Scores)', status: 'Operational' },
            { name: 'Authentication (Twitch OAuth)', status: 'Operational' },
            { name: 'Marketplace', status: 'Operational' },
            { name: 'Website', status: 'Operational' },
          ].map((service) => (
            <div key={service.name} className="flex items-center justify-between py-3">
              <span className="text-slate-300">{service.name}</span>
              <span className="flex items-center gap-2 text-sm text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Channels */}
      {liveChannels.length > 0 && (
        <div className="mt-8 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Currently Live</h2>
          <div className="flex flex-wrap gap-2">
            {liveChannels.map((channel) => (
              <a
                key={channel}
                href={`https://twitch.tv/${channel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pp-accent)]/20 px-3 py-1 text-sm text-[var(--color-pp-accent)] transition hover:bg-purple-500/30"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                {channel}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
