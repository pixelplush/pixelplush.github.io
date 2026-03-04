'use client';

import { useState } from 'react';

const ROOMS_URL = 'https://stats.pixelplush.dev';

interface DiagResult {
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'info';
  detail: string;
}

export default function TroubleshootPage() {
  const [channel, setChannel] = useState('');
  const [results, setResults] = useState<DiagResult[]>([]);
  const [running, setRunning] = useState(false);

  async function runDiagnostics() {
    if (!channel.trim()) return;
    setRunning(true);
    setResults([]);
    const diag: DiagResult[] = [];
    const ch = channel.trim().toLowerCase();

    // Check 1: API reachable
    try {
      const res = await fetch(`https://api.pixelplush.dev/v1/analytics/sessions/live/short`);
      const data = await res.json();
      diag.push({
        label: 'API Server',
        status: 'pass',
        detail: `API is responding. ${data.length} channel(s) live.`,
      });
    } catch {
      diag.push({ label: 'API Server', status: 'fail', detail: 'Cannot reach PixelPlush API.' });
    }

    // Check 2: Rooms server
    try {
      const res = await fetch(`${ROOMS_URL}/healthcheck`);
      if (res.ok) {
        diag.push({ label: 'Rooms Server', status: 'pass', detail: 'Rooms server responding.' });
      } else {
        diag.push({ label: 'Rooms Server', status: 'warn', detail: `Rooms returned status ${res.status}.` });
      }
    } catch {
      diag.push({ label: 'Rooms Server', status: 'fail', detail: 'Cannot reach Rooms server.' });
    }

    // Check 3: Channel status
    try {
      const res = await fetch(`${ROOMS_URL}/v1/channel/status?channel=${ch}`);
      const data = await res.json();
      if (data && data.channel) {
        diag.push({
          label: 'Channel Session',
          status: 'pass',
          detail: `Channel "${ch}" has an active session. Game: ${data.game || 'unknown'}.`,
        });
      } else {
        diag.push({
          label: 'Channel Session',
          status: 'warn',
          detail: `No active session found for "${ch}". Make sure the game overlay is open in OBS.`,
        });
      }
    } catch {
      diag.push({
        label: 'Channel Session',
        status: 'info',
        detail: `Could not check channel status for "${ch}".`,
      });
    }

    // Check 4: Twitch connection advice
    diag.push({
      label: 'Twitch Chat',
      status: 'info',
      detail: 'Ensure your chat is working and the overlay URL includes your channel name as a parameter.',
    });

    // Check 5: Browser source tips
    diag.push({
      label: 'OBS Browser Source',
      status: 'info',
      detail: 'Set resolution to 1920x1080. Enable "Shutdown source when not visible" and "Refresh browser when scene becomes active".',
    });

    setResults(diag);
    setRunning(false);
  }

  const statusStyles: Record<string, string> = {
    pass: 'border-green-500/30 bg-green-500/10 text-green-400',
    fail: 'border-red-500/30 bg-red-500/10 text-red-400',
    warn: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  };

  const statusIcons: Record<string, string> = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">Troubleshoot</h1>
      <p className="mb-8 text-slate-400">
        Having issues with your PixelPlush game? Run diagnostics to check your setup.
      </p>

      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <label className="mb-2 block text-sm font-medium text-slate-400">Your Twitch Channel Name</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value.toLowerCase())}
            placeholder="e.g. instafluff"
            className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3 text-white placeholder-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          />
          <button
            onClick={runDiagnostics}
            disabled={!channel.trim() || running}
            className="rounded-lg bg-[var(--color-pp-accent)] px-6 py-3 font-medium text-white transition hover:bg-[#4a7de0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Run Diagnostics'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className={`rounded-lg border p-4 ${statusStyles[r.status]}`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg font-bold">{statusIcons[r.status]}</span>
                <div>
                  <h3 className="font-semibold text-white">{r.label}</h3>
                  <p className="mt-0.5 text-sm opacity-90">{r.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Common Issues */}
      <div className="mt-10 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Common Issues</h2>
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h3 className="font-medium text-white">Game not showing in OBS</h3>
            <p className="mt-1 text-slate-400">
              Make sure you added the browser source URL from the{' '}
              <a href="/customize" className="text-[var(--color-pp-accent)] hover:underline">customize page</a>.
              Set the resolution to 1920×1080 and check that it&apos;s visible in your scene.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white">Chat commands not working</h3>
            <p className="mt-1 text-slate-400">
              Verify the overlay URL includes your channel name. Refresh the browser source in OBS.
              Make sure the game is the right one for the commands you&apos;re trying.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white">Channel Points rewards not triggering</h3>
            <p className="mt-1 text-slate-400">
              Channel Point integration requires the overlay to be loaded and connected. Check the
              Rooms server status above. Ensure you&apos;ve set up the custom rewards in your Twitch dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white">Need more help?</h3>
            <p className="mt-1 text-slate-400">
              Join the{' '}
              <a href="https://discord.gg/pixelplush" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-accent)] hover:underline">
                PixelPlush Discord
              </a>{' '}
              for community support, or email{' '}
              <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-accent)] hover:underline">
                support@pixelplush.dev
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
