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

const quickIssueIds = ['nothing', 'chat', 'channelpoints', 'freeze', 'flicker', 'confetti'] as const;
const tipCounts: Record<string, number> = { nothing: 5, chat: 4, channelpoints: 5, freeze: 4, flicker: 4, confetti: 5 };

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
    { id: 'https', label: 'checklist.https', auto: true, checked: false },
    { id: 'channel', label: 'checklist.channel', auto: true, checked: false },
    { id: 'oauth', label: 'checklist.oauth', auto: true, checked: false },
    { id: 'obs-update', label: 'checklist.obsUpdate', checked: false },
    { id: 'dimensions', label: 'checklist.dimensions', checked: false },
    { id: 'shutdown', label: 'checklist.shutdown', checked: false },
    { id: 'refresh', label: 'checklist.refresh', checked: false },
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
        diag.push({ label: t('troubleshoot.diag.domain'), status: 'pass', detail: t('troubleshoot.diag.domainPass').replace('{0}', url.hostname) });
      } else {
        diag.push({ label: t('troubleshoot.diag.domain'), status: 'fail', detail: t('troubleshoot.diag.domainFail').replace('{0}', url.hostname) });
      }

      // HTTPS
      if (url.protocol === 'https:') {
        diag.push({ label: t('troubleshoot.diag.https'), status: 'pass', detail: t('troubleshoot.diag.httpsPass') });
        updateCheck('https', true);
      } else {
        diag.push({ label: t('troubleshoot.diag.https'), status: 'warn', detail: t('troubleshoot.diag.httpsFail') });
        updateCheck('https', false);
      }

      // Channel param
      const channel = url.searchParams.get('channel');
      if (channel) {
        diag.push({ label: t('troubleshoot.diag.channel'), status: 'pass', detail: t('troubleshoot.diag.channelPass').replace('{0}', channel) });
        updateCheck('channel', true);
      } else {
        diag.push({ label: t('troubleshoot.diag.channel'), status: 'fail', detail: t('troubleshoot.diag.channelFail') });
        updateCheck('channel', false);
      }

      // OAuth / token
      const oauth = url.searchParams.get('oauth') || url.searchParams.get('token') || url.searchParams.get('twitch');
      if (oauth) {
        diag.push({ label: t('troubleshoot.diag.oauthToken'), status: 'pass', detail: t('troubleshoot.diag.oauthPass').replace('{0}', oauth.slice(0, 8)) });
        updateCheck('oauth', true);
      } else {
        diag.push({ label: t('troubleshoot.diag.oauthToken'), status: 'warn', detail: t('troubleshoot.diag.oauthFail') });
        updateCheck('oauth', false);
      }

      // Theme info
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        diag.push({ label: t('troubleshoot.diag.gameTheme'), status: 'info', detail: t('troubleshoot.diag.gameThemeInfo').replace('{0}', pathParts.join('/')) });
      }

      // Detect confetti-specific
      const isConfetti = url.hostname.includes('confetti') || url.pathname.includes('confetti') ||
        url.searchParams.has('cpConfetti') || url.searchParams.has('cpBubbles') ||
        url.searchParams.has('cpBalloons') || url.searchParams.has('cpHearts');
      if (isConfetti) {
        diag.push({ label: t('troubleshoot.diag.confettiDetected'), status: 'info', detail: t('troubleshoot.diag.confettiInfo') });
      }
    } catch {
      diag.push({ label: 'URL Format', status: 'fail', detail: t('troubleshoot.diag.urlFormatFail') });
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
        <h2 className="mb-3 text-lg font-semibold text-[var(--color-pp-headings)]">{t('troubleshoot.setupChecklist')}</h2>
        <p className="mb-3 text-sm text-[var(--color-pp-text-muted)]">
          {t('troubleshoot.setupChecklistDesc')}
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
                {t(`troubleshoot.${item.label}`)}
                {item.auto && <span className="ml-1 text-[10px] text-[var(--color-pp-text-muted)]">{t('troubleshoot.auto')}</span>}
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
          {quickIssueIds.map((id) => (
            <div key={id}>
              <button
                onClick={() => setExpandedIssue(expandedIssue === id ? null : id)}
                className="flex w-full items-center justify-between rounded-lg bg-[var(--color-pp-bg)]/50 px-4 py-3 text-left text-sm font-medium text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-card-hover)]"
              >
                {t(`troubleshoot.issues.${id}.title`)}
                <span className="text-[var(--color-pp-text-muted)]">{expandedIssue === id ? '−' : '+'}</span>
              </button>
              {expandedIssue === id && (
                <div className="mt-1 rounded-lg bg-[var(--color-pp-bg)]/30 px-4 py-3">
                  <ul className="space-y-1.5 text-sm text-[var(--color-pp-text-muted)]">
                    {Array.from({ length: tipCounts[id] }).map((_, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 shrink-0 text-[var(--color-pp-accent)]">•</span>
                        {t(`troubleshoot.issues.${id}.tip${i + 1}`)}
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
          {t('troubleshoot.stillStuck')}
        </p>
      </div>
    </div>
  );
}
