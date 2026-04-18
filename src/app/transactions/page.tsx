'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n';

const STATS_URL = 'https://stats.pixelplush.dev/v1';
const CATALOG_URL = 'https://www.pixelplush.dev/assets/catalog.json';

interface CatalogItem {
  id: string;
  name: string;
  type: string;
  cost: number;
}

interface TransactionEntry {
  date: string;
  type: 'redeem' | 'purchase';
  description: string;
  amount: number;
  item?: string;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, token, login } = useAuth();
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [catalogMap, setCatalogMap] = useState<Record<string, CatalogItem>>({});
  const [filter, setFilter] = useState<'all' | 'redeem' | 'purchase'>('all');

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((data: CatalogItem[]) => {
        const map: Record<string, CatalogItem> = {};
        data.forEach((item) => { map[item.id] = item; });
        setCatalogMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) return;
    setTxLoading(true);
    fetch(`${STATS_URL}/transactions/user`, {
      headers: { Twitch: token },
    })
      .then((r) => r.json())
      .then((data) => {
        const entries: TransactionEntry[] = [];
        const receipts = data?.receipts || data;

        // Process "from" entries (item redemptions — coins spent)
        if (receipts?.from && Array.isArray(receipts.from)) {
          receipts.from.forEach((tx: Record<string, unknown>) => {
            entries.push({
              date: (tx.date || tx.timestamp || '') as string,
              type: 'redeem',
              description: (tx.item || tx.name || 'Item Redeemed') as string,
              amount: typeof tx.amount === 'number' ? -Math.abs(tx.amount) : (typeof tx.cost === 'number' ? -Math.abs(tx.cost) : 0),
              item: (tx.item || tx.id || '') as string,
            });
          });
        }

        // Process "to" entries (coin purchases — coins gained)
        if (receipts?.to && Array.isArray(receipts.to)) {
          receipts.to.forEach((tx: Record<string, unknown>) => {
            entries.push({
              date: (tx.date || tx.timestamp || '') as string,
              type: 'purchase',
              description: (tx.item || tx.name || 'Coin Purchase') as string,
              amount: typeof tx.amount === 'number' ? tx.amount : 0,
              item: (tx.item || tx.id || '') as string,
            });
          });
        }

        // Sort by date descending
        entries.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setTransactions(entries);
        setTxLoading(false);
      })
      .catch(() => setTxLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === filter);
  }, [transactions, filter]);

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
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">{t("transactions.title")}</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">{t("transactions.loginPrompt")}</p>
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

  const redeemCount = transactions.filter((t) => t.type === 'redeem').length;
  const purchaseCount = transactions.filter((t) => t.type === 'purchase').length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{t("transactions.title")}</h1>
        <p className="mt-1 text-[var(--color-pp-text-muted)]">{t("transactions.subtitle")}</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { key: 'all' as const, label: t('transactions.all'), count: transactions.length },
          { key: 'redeem' as const, label: t('transactions.redemptions'), count: redeemCount },
          { key: 'purchase' as const, label: t('transactions.purchases'), count: purchaseCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === tab.key
                ? 'bg-[#6eb8a8] text-white'
                : 'bg-[var(--color-pp-card)] text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)]'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-white/70' : 'text-[var(--color-pp-text-muted)]'}`}>
              ({tab.count})
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] overflow-hidden">
        {txLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-center">
            <div className="text-[var(--color-pp-text-muted)]">
              <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-sm">{t("transactions.noFound")}</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-pp-border)]">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 text-xs font-medium text-[var(--color-pp-text-muted)] uppercase tracking-wider">
              <div className="col-span-3">{t("transactions.dateCol")}</div>
              <div className="col-span-2">{t("transactions.typeCol")}</div>
              <div className="col-span-5">{t("transactions.descCol")}</div>
              <div className="col-span-2 text-right">{t("transactions.amountCol")}</div>
            </div>
            {filtered.map((tx, i) => {
              const itemName = tx.item && catalogMap[tx.item] ? catalogMap[tx.item].name : tx.description;
              return (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-5 py-3 text-sm hover:bg-[var(--color-pp-card-hover)] transition">
                  <div className="sm:col-span-3 text-[var(--color-pp-text-muted)] text-xs sm:text-sm">
                    {tx.date ? formatDate(tx.date) : '—'}
                  </div>
                  <div className="sm:col-span-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      tx.type === 'redeem'
                        ? 'bg-blue-500/15 text-blue-500'
                        : 'bg-green-500/15 text-green-500'
                    }`}>
                      {tx.type === 'redeem' ? t('transactions.redeemed') : t('transactions.purchased')}
                    </span>
                  </div>
                  <div className="sm:col-span-5 text-[var(--color-pp-text)] truncate">
                    {itemName}
                  </div>
                  <div className={`sm:col-span-2 text-right font-medium ${
                    tx.amount < 0 ? 'text-[var(--color-pp-danger)]' : 'text-green-500'
                  }`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
