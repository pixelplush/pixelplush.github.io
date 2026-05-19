'use client';

import { useAuth } from '@/lib/auth';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n';

const STATS_URL = 'https://stats.pixelplush.dev/v1';
const API_URL = 'https://api.pixelplush.dev/v1';
const CATALOG_URL = 'https://cdn.pixelplush.dev/assets/catalog.json';
const ASSETS_BASE = 'https://cdn.pixelplush.dev/assets';

interface CatalogItem {
  id: string;
  name: string;
  type: string;
  group: string;
  theme: string;
  cost: number;
  path: string;
  hidden?: boolean;
  category?: string;
}

function getItemPreviewUrl(item: CatalogItem): string {
  if (item.theme === 'None') return '';
  switch (item.type) {
    case 'pet':
      return `${ASSETS_BASE}/pets/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'bundle':
      return `${ASSETS_BASE}/bundles/${item.path}`;
    case 'add-on':
      return `${ASSETS_BASE}/add-ons/${item.path}`;
    case 'body':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/body/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'outfit':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/outfits/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'accessory':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/accessories/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'effect':
      return `${ASSETS_BASE}/skins/effects/${item.path}/${item.path}_front/${item.path}_front1.png`;
    default:
      return `${ASSETS_BASE}/${item.type}s/${item.id}/${item.id}_front/${item.id}_front1.png`;
  }
}

/** Format raw code string into XXXX-XXXX-XXXX groups (unless PIXELPLUSH prefix) */
function formatCode(raw: string): string {
  const stripped = raw.replace(/-/g, '').toUpperCase();
  if (stripped.startsWith('PIXELPLUSH')) return stripped;
  if (stripped.length === 0) return '';
  return stripped.match(/.{1,4}/g)!.join('-');
}

interface RedeemResult {
  coins?: number;
  item?: string;
  error?: string;
  message?: string;
}

function RedeemContent() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, token, login, refreshAccount } = useAuth();
  const searchParams = useSearchParams();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Redemption result
  const [redeemResult, setRedeemResult] = useState<RedeemResult | null>(null);

  // Modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [showActivatePrompt, setShowActivatePrompt] = useState(false);
  const [activating, setActivating] = useState(false);

  // Catalog
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const catalogMap = useMemo(() => {
    const map: Record<string, CatalogItem> = {};
    catalog.forEach((item) => { map[item.id] = item; });
    return map;
  }, [catalog]);

  // Load catalog on mount
  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((data: CatalogItem[]) => setCatalog(data))
      .catch(() => {});
  }, []);

  // Pre-fill from URL ?code= param
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(formatCode(urlCode));
    }
  }, [searchParams]);

  const handleCodeChange = useCallback((value: string) => {
    // Strip non-alphanumeric except dashes, then format
    const cleaned = value.replace(/[^a-zA-Z0-9-]/g, '');
    setCode(formatCode(cleaned));
    setStatus('idle');
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!code.trim() || !token) return;
    setStatus('loading');
    setRedeemResult(null);
    try {
      const res = await fetch(`${API_URL}/coupon/redeem?code=${encodeURIComponent(code.trim())}`, {
        method: 'POST',
        headers: {
          Twitch: token,
        },
      });
      const data: RedeemResult = await res.json();
      if (data.error) {
        setStatus('error');
        setErrorMessage(data.error);
      } else {
        setStatus('success');
        setRedeemResult(data);
        setCode('');
        await refreshAccount();
        setShowResultModal(true);
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('redeem.errorGeneric'));
    }
  }, [code, token, refreshAccount, t]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRedeem();
  }, [handleRedeem]);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    // If the redeemed item is activatable, show the activate prompt
    if (redeemResult && !redeemResult.coins && redeemResult.item) {
      const itemId = redeemResult.item;
      if (!itemId.startsWith('addon') && !itemId.startsWith('bundle')) {
        setShowActivatePrompt(true);
        return;
      }
    }
  }, [redeemResult]);

  const handleActivate = useCallback(async () => {
    if (!token || !redeemResult?.item) return;
    setActivating(true);
    try {
      await fetch(`${STATS_URL}/accounts/design/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Twitch: token,
        },
        body: JSON.stringify({ item: redeemResult.item }),
      });
      await refreshAccount();
    } catch { /* ignore */ }
    setActivating(false);
    setShowActivatePrompt(false);
  }, [token, redeemResult, refreshAccount]);

  const handleDeclineActivate = useCallback(() => {
    setShowActivatePrompt(false);
  }, []);

  // Derive display info for redeemed item
  const redeemedItemInfo = useMemo(() => {
    if (!redeemResult) return null;
    if (redeemResult.coins) {
      return { type: 'coins' as const, coins: redeemResult.coins, name: '', previewUrl: '' };
    }
    if (redeemResult.item) {
      const item = catalogMap[redeemResult.item];
      return {
        type: 'item' as const,
        coins: 0,
        name: item?.name || redeemResult.item,
        previewUrl: item ? getItemPreviewUrl(item) : '',
        itemType: item?.type || '',
      };
    }
    return null;
  }, [redeemResult, catalogMap]);

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
            {t("common.loginWithTwitch")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">{t("redeem.title")}</h1>
      <p className="mb-8 text-[var(--color-pp-text-muted)]">{t("redeem.pageSubtitle")}</p>

      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <label htmlFor="coupon-code" className="mb-2 block text-sm font-medium text-[var(--color-pp-text)]">
          {t('redeem.inputLabel')}
        </label>
        <div className="flex gap-3">
          <input
            id="coupon-code"
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("redeem.placeholder")}
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
              t('redeem.submit')
            )}
          </button>
        </div>

        <p className="mt-2 text-xs text-[var(--color-pp-text-muted)]">
          {t('redeem.hint')}
        </p>

        {status === 'error' && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
      </div>

      {/* ── Result Modal ── */}
      {showResultModal && redeemedItemInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeResultModal}>
          <div
            className="relative w-full max-w-sm animate-[fadeInScale_0.3s_ease-out] rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="mb-2 text-xl font-bold text-[var(--color-pp-headings)]">
              {t('redeem.redeemed')}
            </h2>

            {redeemedItemInfo.type === 'coins' ? (
              <div className="my-4">
                <span className="text-4xl font-bold text-amber-400">{redeemedItemInfo.coins}</span>
                <p className="mt-1 text-[var(--color-pp-text-muted)]">{t('redeem.coinsReceived')}</p>
              </div>
            ) : (
              <div className="my-4">
                {redeemedItemInfo.previewUrl && (
                  <img
                    src={redeemedItemInfo.previewUrl}
                    alt={redeemedItemInfo.name}
                    className="pixelated mx-auto mb-3 h-16 w-16"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
                <p className="text-lg font-semibold text-[var(--color-pp-text)]">{redeemedItemInfo.name}</p>
                {redeemedItemInfo.itemType && (
                  <span className="mt-1 inline-block rounded-full bg-[var(--color-pp-accent)]/15 px-3 py-0.5 text-xs font-medium text-[var(--color-pp-accent)]">
                    {redeemedItemInfo.itemType}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={closeResultModal}
              className="mt-2 w-full rounded-lg bg-[var(--color-pp-accent)] px-6 py-3 font-medium text-white transition hover:bg-[#4a7de0]"
            >
              {t('redeem.awesome')}
            </button>
          </div>
        </div>
      )}

      {/* ── Activate Prompt Modal ── */}
      {showActivatePrompt && redeemedItemInfo && redeemedItemInfo.type === 'item' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-sm animate-[fadeInScale_0.3s_ease-out] rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-8 text-center shadow-2xl">
            {redeemedItemInfo.previewUrl && (
              <img
                src={redeemedItemInfo.previewUrl}
                alt={redeemedItemInfo.name}
                className="pixelated mx-auto mb-4 h-16 w-16"
                style={{ imageRendering: 'pixelated' }}
              />
            )}
            <h2 className="mb-2 text-xl font-bold text-[var(--color-pp-headings)]">
              {t('redeem.useNowTitle').replace('{item}', redeemedItemInfo.name)}
            </h2>
            <p className="mb-6 text-sm text-[var(--color-pp-text-muted)]">
              {t('redeem.useNowDescription').replace('{item}', redeemedItemInfo.name).replace('{type}', redeemedItemInfo.itemType || '')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeclineActivate}
                className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-transparent px-4 py-3 font-medium text-[var(--color-pp-text)] transition hover:bg-[var(--color-pp-border)]/30"
              >
                {t('redeem.no')}
              </button>
              <button
                onClick={handleActivate}
                disabled={activating}
                className="flex-1 rounded-lg bg-[var(--color-pp-accent)] px-4 py-3 font-medium text-white transition hover:bg-[#4a7de0] disabled:opacity-50"
              >
                {activating ? (
                  <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  t('redeem.yes')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RedeemPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" /></div>}>
      <RedeemContent />
    </Suspense>
  );
}
