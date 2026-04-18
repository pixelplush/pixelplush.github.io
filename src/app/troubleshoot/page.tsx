'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/i18n';

interface DiagResult {
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'info';
  detail: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  auto?: boolean;
  checked: boolean;
}

const quickIssues: { id: string; title: string; tips: string[] }[] = [
  {
    id: 'nothing',
    title: 'Nothing shows up',
    tips: [
      'Make sure the URL is correct — copy it fresh from the Games page.',
      'Set OBS browser source dimensions to at least 1920×1080.',
      'Disable "Shutdown source when not visible" in OBS.',
      'Right-click the source → Refresh, or toggle visibility off/on.',
      'Try the connection tester above to make sure servers are reachable.',
    ],
  },
  {
    id: 'chat',
    title: "Game doesn't respond to chat",
    tips: [
      'Make sure the URL includes your channel name (e.g., ?channel=yourchannel).',
      'Wait 10–15 seconds after loading — the game needs a moment to connect.',
      'Try typing !play or !join in your chat.',
      'Tokens auto-refresh — if chat still doesn\'t work after a minute, regenerate the link.',
    ],
  },
  {
    id: 'channelpoints',
    title: "Channel point rewards don't work",
    tips: [
      'An OAuth token IS needed for channel points — make sure the URL has one.',
      'Tokens auto-refresh — but if stale, regenerate the link from the Games page.',
      'You must be a Twitch Affiliate or Partner for channel point rewards.',
      'Check that you haven\'t created duplicate rewards with the same name.',
      'Make sure the game overlay is loaded in OBS when testing.',
    ],
  },
  {
    id: 'freeze',
    title: 'Game freezes or stops',
    tips: [
      'Enable "Refresh browser when scene becomes active" in OBS browser source settings.',
      'Disable "Shutdown source when not visible" — this kills the game when switching scenes.',
      'Check CPU/GPU usage — if OBS is struggling, the browser source may lag.',
      'Right-click the source → Refresh to restart it.',
    ],
  },
  {
    id: 'flicker',
    title: 'Screen flickers',
    tips: [
      'Update OBS to the latest version.',
      'Use a single theme (don\'t rotate themes rapidly).',
      'Toggle "Use custom frame rate" off in browser source settings.',
      'Try disabling hardware acceleration in OBS: Settings → Advanced → uncheck "Enable Browser Source Hardware Acceleration".',
    ],
  },
  {
    id: 'confetti',
    title: "Confetti/overlay doesn't appear",
    tips: [
      'Confetti is passive — it doesn\'t show until triggered by a channel point redemption.',
      'Test it by typing !confetti 10 in chat (if chat commands are enabled).',
      'OAuth token is needed for channel point triggers — check the URL.',
      'Make sure cpConfetti=true is in the URL for confetti functionality.',
      'Try !resetconfetti to clear stuck effects.',
    ],
  },
];

function validDomain(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return host === 'pixelplush.dev' || host.endsWith('.pixelplush.dev') || host === 'localhost' || host === '127.0.0.1';
}

export default function TroubleshootPage() {
  const { t } = useTranslation();
  const [urlInput, setUrlInput] = useState('');
  const [urlResults, setUrlResults] = useState<DiagResult[]>([]);
  const [connResults, setConnResults] = useState<DiagResult[]>([]);
  const [tokenResult, setTokenResult] = useState<DiagResult | null>(null);
  const [connRunning, setConnRunning] = useState(false);
  const [tokenRunning, setTokenRunning] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'https', label: 'URL is using HTTPS', auto: true, checked: false },
    { id: 'channel', label: 'Channel name is in URL', auto: true, checked: false },
    { id: 'oauth', label: 'OAuth token is in URL', auto: true, checked: false },
    { id: 'obs-update', label: 'OBS is up-to-date', checked: false },
    { id: 'dimensions', label: 'Browser source is at least 800×600', checked: false },
    { id: 'shutdown', label: '"Shutdown source when not visible" is disabled', checked: false },
    { id: 'refresh', label: '"Refresh browser when scene becomes active" is enabled', checked: false },
  ]);
  const [reportCopied, setReportCopied] = useState(false);

  const validateUrl = useCallback((urlStr: string) => {
    if (!urlStr.trim()) { setUrlResults([]); return; }
    const diag: DiagResult[] = [];
    const updateCheck = (id: string, val: boolean) => {
      setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, checked: val } : c));
    };

    try {
      const url = new URL(urlStr.trim());

      // Domain check
      if (validDomain(url)) {
        diag.push({ label: 'Domain', status: 'pass', detail: `Valid PixelPlush domain: ${url.hostname}` });
      } else {
        diag.push({ label: 'Domain', status: 'fail', detail: `Unknown domain "${url.hostname}". Expected pixelplush.dev.` });
      }

      // HTTPS
      if (url.protocol === 'https:') {
        diag.push({ label: 'HTTPS', status: 'pass', detail: 'Using secure HTTPS connection.' });
        updateCheck('https', true);
      } else {
        diag.push({ label: 'HTTPS', status: 'warn', detail: 'Not using HTTPS. Some features may not work.' });
        updateCheck('https', false);
      }

      // Channel param
      const channel = url.searchParams.get('channel');
      if (channel) {
        diag.push({ label: 'Channel', status: 'pass', detail: `Channel: ${channel}` });
        updateCheck('channel', true);
      } else {
        diag.push({ label: 'Channel', status: 'fail', detail: 'No "channel" parameter found. The game won\'t know which chat to connect to.' });
        updateCheck('channel', false);
      }

      // OAuth / token
      const oauth = url.searchParams.get('oauth') || url.searchParams.get('token') || url.searchParams.get('twitch');
      if (oauth) {
        diag.push({ label: 'OAuth Token', status: 'pass', detail: `Token found (${oauth.slice(0, 8)}...).` });
        updateCheck('oauth', true);
      } else {
        diag.push({ label: 'OAuth Token', status: 'warn', detail: 'No OAuth token. Channel Points and some features require a token. Games will auto-refresh tokens when possible.' });
        updateCheck('oauth', false);
      }

      // Theme info
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        diag.push({ label: 'Game/Theme', status: 'info', detail: `Path: /${pathParts.join('/')}` });
      }

      // Detect confetti-specific
      const isConfetti = url.hostname.includes('confetti') || url.pathname.includes('confetti') ||
        url.searchParams.has('cpConfetti') || url.searchParams.has('cpBubbles') ||
        url.searchParams.has('cpBalloons') || url.searchParams.has('cpHearts');
      if (isConfetti) {
        diag.push({ label: 'Confetti Detected', status: 'info', detail: 'This looks like a Confetti/overlay URL. Remember: it won\'t show anything until triggered.' });
      }
    } catch {
      diag.push({ label: 'URL Format', status: 'fail', detail: 'Invalid URL. Make sure you copied the full URL including https://' });
    }

    setUrlResults(diag);
  }, []);

  const testConnection = useCallback(async () => {
    setConnRunning(true);
    setConnResults([]);
    const endpoints = [
      { label: 'API Server', url: 'https://api.pixelplush.dev/v1/status' },
      { label: 'Stats Server', url: 'https://stats.pixelplush.dev/v1/status' },
      { label: 'Ping', url: 'https://api.pixelplush.dev/ping' },
    ];

    const results: DiagResult[] = [];
    for (const ep of endpoints) {
      const start = performance.now();
      try {
        const res = await fetch(ep.url);
        const ms = Math.round(performance.now() - start);
        if (res.ok) {
          results.push({ label: ep.label, status: 'pass', detail: `Responding (${ms}ms)` });
        } else {
          results.push({ label: ep.label, status: 'warn', detail: `Status ${res.status} (${ms}ms)` });
        }
      } catch {
        results.push({ label: ep.label, status: 'fail', detail: 'Cannot reach server.' });
      }
    }

    setConnResults(results);
    setConnRunning(false);
  }, []);

  const validateToken = useCallback(async () => {
    // Extract token from URL input
    let token = '';
    try {
      const url = new URL(urlInput.trim());
      token = url.searchParams.get('oauth') || url.searchParams.get('token') || url.searchParams.get('twitch') || '';
    } catch { /* ignore */ }

    if (!token) {
      setTokenResult({ label: 'Token Health', status: 'info', detail: 'No token found in the URL above. Paste a URL with an OAuth token first.' });
      return;
    }

    setTokenRunning(true);
    try {
      const res = await fetch('https://id.twitch.tv/oauth2/validate', {
        headers: { Authorization: `OAuth ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const expiresIn = data.expires_in || 0;
        const hours = Math.floor(expiresIn / 3600);
        const days = Math.floor(hours / 24);
        let expiry = `${expiresIn}s`;
        if (days > 0) expiry = `${days} day(s)`;
        else if (hours > 0) expiry = `${hours} hour(s)`;

        let status: 'pass' | 'warn' = 'pass';
        let extra = '';
        if (expiresIn < 86400) { status = 'warn'; extra = ' Token expires soon — consider regenerating the link.'; }

        setTokenResult({
          label: 'Token Health',
          status,
          detail: `Valid token for user "${data.login}". Expires in ${expiry}. Scopes: ${(data.scopes || []).join(', ') || 'none'}.${extra}`,
        });
      } else {
        setTokenResult({
          label: 'Token Health',
          status: 'warn',
          detail: 'Token is invalid or expired. Don\'t worry — games auto-refresh tokens. If the game isn\'t responding, regenerate the link from the Games page.',
        });
      }
    } catch {
      setTokenResult({ label: 'Token Health', status: 'fail', detail: 'Could not validate token with Twitch.' });
    }
    setTokenRunning(false);
  }, [urlInput]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) => prev.map((c) => c.id === id && !c.auto ? { ...c, checked: !c.checked } : c));
  };

  const generateReport = () => {
    const lines = [
      `PixelPlush Support Report — ${new Date().toLocaleString()}`,
      '',
      '=== URL Check ===',
      ...urlResults.map((r) => `[${r.status.toUpperCase()}] ${r.label}: ${r.detail}`),
      urlResults.length === 0 ? 'No URL checked' : '',
      '',
      '=== Connection Test ===',
      ...connResults.map((r) => `[${r.status.toUpperCase()}] ${r.label}: ${r.detail}`),
      connResults.length === 0 ? 'Not tested' : '',
      '',
      '=== Token Health ===',
      tokenResult ? `[${tokenResult.status.toUpperCase()}] ${tokenResult.detail}` : 'Not checked',
      '',
      '=== Checklist ===',
      ...checklist.map((c) => `[${c.checked ? 'x' : ' '}] ${c.label}`),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  const statusStyles: Record<string, string> = {
    pass: 'border-[var(--color-pp-success)]/30 bg-[var(--color-pp-success)]/10',
    fail: 'border-[var(--color-pp-danger)]/30 bg-[var(--color-pp-danger)]/10',
    warn: 'border-amber-600/30 bg-amber-600/10',
    info: 'border-[var(--color-pp-accent)]/30 bg-[var(--color-pp-accent)]/10',
  };

  const statusTextStyles: Record<string, string> = {
    pass: 'text-[var(--color-pp-success)]',
    fail: 'text-[var(--color-pp-danger)]',
    warn: 'text-amber-700',
    info: 'text-[var(--color-pp-accent)]',
  };

  const statusIcons: Record<string, string> = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">{t("troubleshoot.title")}</h1>
      <p className="mb-6 text-[var(--color-pp-text-muted)]">
        {t("troubleshoot.subtitle")}
      </p>

      {/* Section 1: URL Validator */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">{t("troubleshoot.checkUrl")}</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">{t("troubleshoot.checkUrlDesc")}</p>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => { setUrlInput(e.target.value); validateUrl(e.target.value); }}
          placeholder={t("troubleshoot.urlPlaceholder")}
          className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-3 text-sm text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none"
        />
        {urlResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {urlResults.map((r, i) => (
              <div key={i} className={`rounded-lg border px-3 py-2 text-sm ${statusStyles[r.status]}`}>
                <span className={`mr-2 font-bold ${statusTextStyles[r.status]}`}>{statusIcons[r.status]}</span>
                <span className="font-medium text-[var(--color-pp-headings)]">{r.label}: </span>
                <span className="text-[var(--color-pp-text)]">{r.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Connection Test */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">{t("troubleshoot.testConnection")}</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">{t("troubleshoot.testConnectionDesc")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testConnection}
            disabled={connRunning}
            className="rounded-lg bg-[var(--color-pp-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a7de0] disabled:opacity-50"
          >
            {connRunning ? t('troubleshoot.testing') : t('troubleshoot.testServers')}
          </button>
          <button
            onClick={validateToken}
            disabled={tokenRunning}
            className="rounded-lg border border-[var(--color-pp-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-card-hover)] disabled:opacity-50"
          >
            {tokenRunning ? t('troubleshoot.checking') : t('troubleshoot.checkToken')}
          </button>
        </div>
        {connResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {connResults.map((r, i) => (
              <div key={i} className={`rounded-lg border px-3 py-2 text-sm ${statusStyles[r.status]}`}>
                <span className={`mr-2 font-bold ${statusTextStyles[r.status]}`}>{statusIcons[r.status]}</span>
                <span className="font-medium text-[var(--color-pp-headings)]">{r.label}: </span>
                <span className="text-[var(--color-pp-text)]">{r.detail}</span>
              </div>
            ))}
          </div>
        )}
        {tokenResult && (
          <div className={`mt-3 rounded-lg border px-3 py-2 text-sm ${statusStyles[tokenResult.status]}`}>
            <span className={`mr-2 font-bold ${statusTextStyles[tokenResult.status]}`}>{statusIcons[tokenResult.status]}</span>
            <span className="font-medium text-[var(--color-pp-headings)]">{tokenResult.label}: </span>
            <span className="text-[var(--color-pp-text)]">{tokenResult.detail}</span>
          </div>
        )}
      </div>

      {/* Section 3: Checklist */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">3. Setup Checklist</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">
          First 3 items auto-check when you validate a URL. Click the rest to confirm manually.
        </p>
        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                item.auto ? 'cursor-default' : 'cursor-pointer hover:bg-[var(--color-pp-card-hover)]'
              }`}
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                item.checked
                  ? 'border-[var(--color-pp-success)] bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]'
                  : 'border-[var(--color-pp-border)] text-transparent'
              }`}>
                ✓
              </span>
              <span className={`${item.checked ? 'text-[var(--color-pp-text)]' : 'text-[var(--color-pp-text-muted)]'}`}>
                {item.label}
                {item.auto && <span className="ml-1 text-[10px] text-[var(--color-pp-text-muted)]">(auto)</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 4: Quick Troubleshooter */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">{t("troubleshoot.commonIssues")}</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">{t("troubleshoot.commonIssuesDesc")}</p>
        <div className="space-y-2">
          {quickIssues.map((issue) => (
            <div key={issue.id}>
              <button
                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                className="flex w-full items-center justify-between rounded-lg bg-[var(--color-pp-bg)]/50 px-4 py-3 text-left text-sm font-medium text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-card-hover)]"
              >
                {issue.title}
                <span className="text-[var(--color-pp-text-muted)]">{expandedIssue === issue.id ? '−' : '+'}</span>
              </button>
              {expandedIssue === issue.id && (
                <div className="mt-1 rounded-lg bg-[var(--color-pp-bg)]/30 px-4 py-3">
                  <ul className="space-y-1.5 text-sm text-[var(--color-pp-text-muted)]">
                    {issue.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 shrink-0 text-[var(--color-pp-accent)]">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Generate Report */}
      <div className="mb-6 rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">{t("troubleshoot.generateReport")}</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">
          {t("troubleshoot.generateReportDesc")}
        </p>
        <button
          onClick={generateReport}
          className="rounded-lg bg-[var(--color-pp-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a7de0]"
        >
          {reportCopied ? t('troubleshoot.copied') : t('troubleshoot.copyReport')}
        </button>
      </div>

      {/* Need more help */}
      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5 text-center">
        <p className="text-sm text-[var(--color-pp-text-muted)]">
          Still stuck? Join the{' '}
          <a href="https://discord.gg/pixelplush" target="_blank" rel="noopener noreferrer" className="text-[var(--color-pp-link)] hover:underline">
            PixelPlush Discord
          </a>{' '}
          or email{' '}
          <a href="mailto:support@pixelplush.dev" className="text-[var(--color-pp-link)] hover:underline">
            support@pixelplush.dev
          </a>
        </p>
      </div>
    </div>
  );
}
