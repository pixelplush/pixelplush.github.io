'use client';

import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import Script from 'next/script';
import { useTranslation } from '@/i18n';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { assetPath } from '@/lib/assetPath';

const CATALOG_URL = 'https://www.pixelplush.dev/assets/catalog.json';
const API_URL = 'https://api.pixelplush.dev/v1';
const STATS_URL = 'https://stats.pixelplush.dev/v1';
const PAYPAL_CLIENT_ID = 'Ac8ThQDkE1sBoHpJD4cgrd4nEyF0gYuUzQwNzSolvCVjGondlvAYy7mlQdFaV5RpspBzBFjnn9Mt8dep';

interface CatalogItem {
  id: string;
  name: string;
  type: string;
  group: string;
  theme: string;
  cost: number;
  path: string;
  hidden?: boolean;
  beta?: boolean;
  sale?: boolean;
  subscription?: string;
  items?: string;
  category?: string;
}

const typeColors: Record<string, string> = {
  character: 'bg-blue-600/15 text-blue-800',
  pet: 'bg-red-600/15 text-red-800',
  'add-on': 'bg-green-600/15 text-green-800',
  bundle: 'bg-cyan-600/15 text-cyan-800',
  body: 'bg-amber-600/15 text-amber-800',
  equipment: 'bg-orange-600/15 text-orange-800',
  accessory: 'bg-purple-600/15 text-purple-800',
  outfit: 'bg-pink-600/15 text-pink-800',
  effect: 'bg-teal-600/15 text-teal-800',
};

const coinPackages = [
  { coins: 25, baseCoins: 25, price: '$5', bonus: '', popular: false },
  { coins: 55, baseCoins: 50, price: '$10', bonus: '+10%', popular: true },
  { coins: 120, baseCoins: 100, price: '$20', bonus: '+20%', popular: false },
  { coins: 625, baseCoins: 500, price: '$100', bonus: '+25%', popular: false },
];

function getItemPreview(item: CatalogItem): string {
  switch (item.type) {
    case 'bundle':
      return `https://www.pixelplush.dev/assets/bundles/${item.path}`;
    case 'add-on':
      return `https://www.pixelplush.dev/assets/add-ons/${item.path}`;
    case 'pet':
      return `https://www.pixelplush.dev/assets/pets/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'body':
      return `https://www.pixelplush.dev/assets/skins/body/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'equipment':
      return `https://www.pixelplush.dev/assets/skins/equipment/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'accessory':
      return `https://www.pixelplush.dev/assets/skins/accessories/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'outfit':
      return `https://www.pixelplush.dev/assets/skins/outfits/${item.category}/${item.path}/${item.path}_front/${item.path}_front1.png`;
    case 'effect':
      return `https://www.pixelplush.dev/assets/skins/effects/${item.path}/${item.path}_front/${item.path}_front1.png`;
    default:
      return `https://www.pixelplush.dev/assets/${item.type}s/${item.id}/${item.id}_front/${item.id}_front1.png`;
  }
}

type FilterType = 'character' | 'pet' | 'add-on' | 'bundle' | 'outfit';

export default function MarketPage() {
  const { t } = useTranslation();
  const { isLoggedIn, account, token, login, refreshAccount } = useAuth();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<FilterType, boolean>>({
    character: true,
    pet: true,
    'add-on': true,
    bundle: true,
    outfit: true,
  });
  const [hideOwned, setHideOwned] = useState(false);
  const [selectedCoinPkg, setSelectedCoinPkg] = useState<(typeof coinPackages)[0] | null>(null);
  const [coinProcessing, setCoinProcessing] = useState(false);
  const [confirmItem, setConfirmItem] = useState<CatalogItem | null>(null);
  const [buyingItem, setBuyingItem] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<{ timer: ReturnType<typeof setInterval>; timeout: ReturnType<typeof setTimeout> } | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current.timer);
        clearTimeout(pollingRef.current.timeout);
      }
    };
  }, []);

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((data: CatalogItem[]) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const owned = useMemo(() => {
    return account?.styles ? new Set<string>(Object.values(account.styles).flat()) : new Set<string>();
  }, [account]);

  const catalogMap = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    catalog.forEach((item) => map.set(item.id, item));
    return map;
  }, [catalog]);

  const bundles = useMemo(() => {
    return catalog
      .filter((x) => !x.hidden && x.type === 'bundle' && !x.subscription)
      .filter((bundle) => {
        if (owned.has(bundle.id)) return false;
        if (bundle.items) {
          const ids = bundle.items.split(',').map((id) => id.trim());
          if (ids.every((id) => owned.has(id))) return false;
        }
        return true;
      });
  }, [catalog, owned]);

  const getBundleSavings = useCallback(
    (bundle: CatalogItem) => {
      if (!bundle.items) return 0;
      const ids = bundle.items.split(',').map((id) => id.trim());
      const total = ids.reduce((sum, id) => sum + (catalogMap.get(id)?.cost ?? 0), 0);
      if (total === 0) return 0;
      return Math.round(((total - bundle.cost) / total) * 100);
    },
    [catalogMap]
  );

  const filteredItems = useMemo(() => {
    let items = catalog.filter((x) => !x.hidden && !x.subscription);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (x) => x.group.toLowerCase().includes(q) || x.name.toLowerCase().includes(q) || x.theme.toLowerCase().includes(q)
      );
    }
    if (!filters.character) items = items.filter((x) => x.type !== 'character');
    if (!filters.pet) items = items.filter((x) => x.type !== 'pet');
    if (!filters['add-on']) items = items.filter((x) => x.type !== 'add-on');
    if (!filters.bundle) items = items.filter((x) => x.type !== 'bundle');
    if (!filters.outfit) items = items.filter((x) => !x.id.startsWith('outfit'));
    if (hideOwned && owned.size > 0) {
      items = items.filter((x) => !owned.has(x.id));
    }
    return items;
  }, [catalog, search, filters, hideOwned, owned]);

  const cheapestUnownedCost = useMemo(() => {
    const unowned = catalog.filter((x) => !x.hidden && !x.subscription && x.cost > 0 && !owned.has(x.id));
    if (unowned.length === 0) return Infinity;
    return Math.min(...unowned.map((x) => (x.sale ? Math.floor(x.cost / 2) : x.cost)));
  }, [catalog, owned]);

  const showNotification = useCallback((type: string, message: string, duration = 5000) => {
    setNotification({ type, message });
    if (duration > 0) setTimeout(() => setNotification(null), duration);
  }, []);

  const buyItem = useCallback(
    async (item: CatalogItem) => {
      if (!token || buyingItem) return;
      setConfirmItem(null);
      setBuyingItem(item.id);
      const cost = item.sale ? Math.floor(item.cost / 2) : item.cost;
      if ((account?.coins ?? 0) < cost) {
        showNotification('error', t('market.notEnoughCoins'));
        setBuyingItem(null);
        return;
      }
      try {
        const result = await fetch(`${API_URL}/shop/buy`, {
          method: 'POST',
          headers: { Twitch: token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: item.id }),
        }).then((r) => r.json());
        if (result.error) throw new Error(result.error);
        await refreshAccount();
        showNotification('success', `You got ${item.name}!`);
        const expectedRemaining = (account?.coins ?? 0) - cost;
        if (expectedRemaining < cheapestUnownedCost && expectedRemaining >= 0) {
          setTimeout(() => {
            showNotification('nudge', 'Running low on coins! Get 22 more for just $4', 8000);
          }, 3000);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Purchase failed';
        showNotification('error', message);
      }
      setBuyingItem(null);
    },
    [token, buyingItem, account, cheapestUnownedCost, refreshAccount, showNotification]
  );

  // Handle Stripe Checkout
  const handleStripeCheckout = useCallback(async () => {
    if (!selectedCoinPkg || !token) return;
    setCoinProcessing(true);
    try {
      const res = await fetch(`${API_URL}/stripe/checkout`, {
        method: 'POST',
        headers: { Twitch: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins: selectedCoinPkg.baseCoins, returnUrl: window.location.origin + '/v2/market/' }),
      }).then((r) => r.json());
      if (!res.success) throw new Error(res.error || 'Failed to start Stripe checkout');
      window.location.href = res.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Stripe checkout failed';
      showNotification('error', message);
      setCoinProcessing(false);
    }
  }, [selectedCoinPkg, token, showNotification]);

  // Handle Stripe redirect return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeResult = params.get('stripe');
    const txnId = params.get('txn');
    if (stripeResult === 'success' && txnId && token) {
      setCoinProcessing(true);
      const timer = setInterval(async () => {
        try {
          const r = await fetch(`${STATS_URL}/transactions/status?id=${txnId}`).then((x) => x.json());
          if (r && r.status !== 'pending') {
            clearInterval(timer);
            clearTimeout(timeout);
            setCoinProcessing(false);
            if (r.status === 'complete') {
              refreshAccount();
              showNotification('success', t('market.coinsPurchased'));
            } else {
              showNotification('error', r.error || 'Transaction failed');
            }
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch {
          /* keep polling */
        }
      }, 5000);
      const timeout = setTimeout(() => {
        clearInterval(timer);
        setCoinProcessing(false);
        showNotification('error', 'Transaction timed out. Contact support if charged.');
        window.history.replaceState({}, '', window.location.pathname);
      }, 120000);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    } else if (stripeResult === 'cancel') {
      showNotification('error', t('market.paymentCancelled'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [token, refreshAccount, showNotification]);

  // Render PayPal buttons when the coin purchase modal opens
  useEffect(() => {
    if (!selectedCoinPkg || !paypalRef.current || !paypalReady || !token) return;
    paypalRef.current.innerHTML = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pp = (window as any).paypal;
    if (!pp) return;

    let txn: { transactionId?: string; price?: string; coins?: number } = {};

    pp.Buttons({
      style: { layout: 'horizontal', color: 'gold', shape: 'pill' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createOrder: async (_data: any, actions: any) => {
        const res = await fetch(`${API_URL}/paypal/request`, {
          method: 'POST',
          headers: { Twitch: token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ coins: selectedCoinPkg.baseCoins }),
        }).then((r) => r.json());
        if (!res.success) throw new Error('Failed to start PayPal request');
        txn = res;
        return actions.order.create({
          purchase_units: [
            {
              reference_id: res.transactionId,
              amount: { value: res.price, currency_code: 'USD' },
              items: [
                {
                  name: 'Plush Coins',
                  unit_amount: { currency_code: 'USD', value: res.price },
                  quantity: res.coins,
                  category: 'DIGITAL_GOODS',
                },
              ],
            },
          ],
          application_context: { brand_name: 'PixelPlush Games', shipping_preference: 'NO_SHIPPING' },
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onApprove: async (_data: any, actions: any) => {
        setCoinProcessing(true);
        try {
          await actions.order.capture();
          await fetch(`${API_URL}/paypal/waiting`, {
            method: 'POST',
            headers: { Twitch: token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins: selectedCoinPkg.baseCoins, transaction: txn.transactionId }),
          });
          // Poll for completion
          await new Promise<void>((resolve, reject) => {
            const timer = setInterval(async () => {
              try {
                const r = await fetch(`${STATS_URL}/transactions/status?id=${txn.transactionId}`).then((x) => x.json());
                if (r && r.status !== 'pending') {
                  clearInterval(timer);
                  clearTimeout(timeout);
                  r.status === 'complete' ? resolve() : reject(new Error(r.error || 'Transaction failed'));
                }
              } catch {
                /* keep polling */
              }
            }, 5000);
            const timeout = setTimeout(() => {
              clearInterval(timer);
              reject(new Error('Transaction timed out'));
            }, 120000);
            pollingRef.current = { timer, timeout };
          });
          pollingRef.current = null;
          await refreshAccount();
          setSelectedCoinPkg(null);
          showNotification('success', `You got ${selectedCoinPkg.coins} Plush Coins!`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : t('market.coinPurchaseFailed');
          showNotification('error', message);
        }
        setCoinProcessing(false);
      },
      onError: () => {
        showNotification('error', t('market.paypalError'));
        setSelectedCoinPkg(null);
        setCoinProcessing(false);
      },
      onCancel: () => {
        setSelectedCoinPkg(null);
        setCoinProcessing(false);
      },
    }).render(paypalRef.current);
  }, [selectedCoinPkg, paypalReady, token, refreshAccount, showNotification]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setPaypalReady(true)}
      />

      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">{t("market.title")}</h1>
        <p className="text-[var(--color-pp-text-muted)]">{t("market.subtitle")}</p>
      </div>

      {/* Coin Strip */}
      <div className="mb-8 rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-100/80 to-yellow-100/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          {isLoggedIn && account ? (
            <div className="flex items-center gap-2 text-base font-semibold text-amber-900">
              <Image src={assetPath('/app-assets/images/icon/plush_coin.gif')} alt="coins" width={24} height={24} className="pixelated" unoptimized />
              Your Balance: {account.coins} {t('market.coins').toLowerCase()}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-amber-800">{t('market.loginToPurchase')}</span>
              <button
                onClick={login}
                className="rounded-lg bg-[var(--color-pp-accent)] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#4a7de0]"
              >
                {t('market.logIn')}
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.coins}
              className={`relative rounded-xl border p-4 text-center transition ${
                pkg.popular
                  ? 'border-amber-400 bg-white ring-2 ring-amber-400/50'
                  : 'border-amber-200/60 bg-white/70'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  ⭐ Most Popular
                </span>
              )}
              <div className="text-sm text-amber-700">{pkg.price}</div>
              <div className="my-1 flex items-center justify-center gap-1 text-xl font-bold text-amber-900">
                <Image src={assetPath('/app-assets/images/icon/plush_coin.gif')} alt="" width={20} height={20} className="pixelated" unoptimized />
                {pkg.coins}
              </div>
              {pkg.bonus ? (
                <div className="mb-2 text-xs font-medium text-amber-600">{pkg.bonus} bonus</div>
              ) : (
                <div className="mb-2 text-xs text-amber-600/60">No bonus</div>
              )}
              {isLoggedIn ? (
                <button
                  onClick={() => setSelectedCoinPkg(pkg)}
                  className="w-full rounded-lg bg-amber-500 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Buy
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-amber-700/70">
          Secure checkout via Stripe or PayPal · Coins are non-refundable
        </p>
      </div>

      {/* Coin Purchase Modal */}
      {selectedCoinPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !coinProcessing && setSelectedCoinPkg(null)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-[var(--color-pp-headings)]">
                <Image src={assetPath('/app-assets/images/icon/plush_coin.gif')} alt="" width={28} height={28} className="pixelated" unoptimized />
                {selectedCoinPkg.coins} Plush Coins
              </div>
              <p className="text-[var(--color-pp-text-muted)]">
                {selectedCoinPkg.coins} coins{selectedCoinPkg.bonus ? ` (${selectedCoinPkg.bonus} bonus)` : ''} for {selectedCoinPkg.price}
              </p>
            </div>
            {coinProcessing ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                <p className="text-sm text-[var(--color-pp-text-muted)]">Processing your purchase...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleStripeCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#635BFF] py-3 text-sm font-semibold text-white transition hover:bg-[#5347E5]"
                >
                  💳 Pay with Card
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--color-pp-border)]" />
                  <span className="text-xs text-[var(--color-pp-text-muted)]">or</span>
                  <div className="h-px flex-1 bg-[var(--color-pp-border)]" />
                </div>
                <div ref={paypalRef} className="min-h-[50px]" />
              </div>
            )}
            {!coinProcessing && (
              <button
                onClick={() => setSelectedCoinPkg(null)}
                className="mt-4 w-full rounded-lg border border-[var(--color-pp-border)] py-2 text-sm text-[var(--color-pp-text-muted)] transition hover:bg-[var(--color-pp-card-hover)]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Item Confirm Modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmItem(null)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex flex-col items-center gap-3">
              <Image src={getItemPreview(confirmItem)} alt={confirmItem.name} width={64} height={64} className="pixelated" unoptimized />
              <h3 className="text-lg font-bold text-[var(--color-pp-headings)]">{confirmItem.name}</h3>
              <p className="text-sm text-[var(--color-pp-text-muted)]">
                This will use{' '}
                <span className="font-semibold text-[var(--color-pp-text)]">
                  {confirmItem.sale ? Math.floor(confirmItem.cost / 2) : confirmItem.cost}
                </span>{' '}
                coins
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmItem(null)}
                className="flex-1 rounded-lg border border-[var(--color-pp-border)] py-2.5 text-sm font-medium text-[var(--color-pp-text-muted)] transition hover:bg-[var(--color-pp-card-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={() => buyItem(confirmItem)}
                className="flex-1 rounded-lg bg-[var(--color-pp-accent)] py-2.5 text-sm font-medium text-white transition hover:bg-[#4a7de0]"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg p-4 shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2.5 text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none sm:w-64"
        />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filters) as FilterType[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition ${
                filters[key]
                  ? typeColors[key] || 'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]'
                  : 'bg-[var(--color-pp-card)] text-slate-500 line-through'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-pp-text)]">
          <input type="checkbox" checked={hideOwned} onChange={(e) => setHideOwned(e.target.checked)} className="rounded" />
          Hide owned items
        </label>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-[var(--color-pp-text-muted)]">No items found</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => {
            const isOwned = owned.has(item.id);
            const isBundle = item.type === 'bundle';
            const savings = isBundle ? getBundleSavings(item) : 0;
            const bundleItemIds = isBundle && item.items ? item.items.split(',').map((id) => id.trim()) : [];
            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border p-3 text-center transition ${
                  isOwned
                    ? 'border-green-500/30 bg-green-500/5'
                    : isBundle
                      ? 'border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-50 to-blue-50 hover:border-cyan-500/50'
                      : 'border-[var(--color-pp-border)] bg-[var(--color-pp-card)] hover:border-[var(--color-pp-accent)]/30'
                }`}
              >
                <div className="mb-2 flex h-20 items-center justify-center">
                  <Image src={getItemPreview(item)} alt={item.name} width={48} height={48} className="pixelated" unoptimized />
                </div>
                <span
                  className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[item.type] || 'bg-[var(--color-pp-bg)]/50 text-[var(--color-pp-text-muted)]'}`}
                >
                  {item.type}
                </span>
                <h3 className="truncate text-xs font-medium text-[var(--color-pp-headings)]">{item.name}</h3>
                {isBundle && bundleItemIds.length > 0 && !isOwned && (
                  <p className="mt-0.5 text-[10px] text-[var(--color-pp-text-muted)]">{bundleItemIds.length} items included</p>
                )}
                <div className="mt-1.5">
                  {isOwned ? (
                    <span className="text-xs font-medium text-[var(--color-pp-success)]">Owned</span>
                  ) : (
                    <>
                      <span className="text-xs text-[var(--color-pp-text-muted)]">
                        <Image
                          src={assetPath('/app-assets/images/icon/plush_coin.gif')}
                          alt=""
                          width={14}
                          height={14}
                          className="pixelated mr-0.5 inline"
                          unoptimized
                        />
                        {item.sale ? (
                          <>
                            <span className="line-through">{item.cost}</span>{' '}
                            <span className="font-medium text-[var(--color-pp-success)]">{Math.floor(item.cost / 2)}</span>
                          </>
                        ) : item.cost === 0 ? (
                          <span className="font-medium text-[var(--color-pp-success)]">FREE</span>
                        ) : (
                          item.cost
                        )}
                        {isBundle && savings > 0 && (
                          <span className="ml-1 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                            Save {savings}%
                          </span>
                        )}
                      </span>
                      {isLoggedIn && (
                        <button
                          onClick={() => setConfirmItem(item)}
                          disabled={!!buyingItem}
                          className={`mt-1.5 w-full cursor-pointer rounded-md py-1 text-[11px] font-medium text-white transition disabled:opacity-50 ${
                            isBundle
                              ? 'bg-cyan-600 hover:bg-cyan-700'
                              : 'bg-[var(--color-pp-accent)] hover:bg-[#4a7de0]'
                          }`}
                        >
                          {buyingItem === item.id ? '...' : isBundle ? 'Buy Bundle' : 'Buy'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
