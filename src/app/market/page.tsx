'use client';

import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

const CATALOG_URL = 'https://www.pixelplush.dev/assets/catalog.json';

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
  character: 'bg-blue-500/20 text-blue-400',
  pet: 'bg-red-500/20 text-red-400',
  'add-on': 'bg-green-500/20 text-green-400',
  bundle: 'bg-cyan-500/20 text-cyan-400',
  body: 'bg-yellow-500/20 text-yellow-400',
  equipment: 'bg-yellow-500/20 text-yellow-400',
  accessory: 'bg-yellow-500/20 text-yellow-400',
  outfit: 'bg-yellow-500/20 text-yellow-400',
  effect: 'bg-yellow-500/20 text-yellow-400',
};

const coinPackages = [
  { coins: 50, price: '$1.99', value: '' },
  { coins: 150, price: '$3.99', value: '' },
  { coins: 400, price: '$7.99', value: 'Popular' },
  { coins: 1100, price: '$19.99', value: 'Best Value' },
  { coins: 6000, price: '$99.99', value: 'Mega Pack' },
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
  const { isLoggedIn, account } = useAuth();
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
  const [tab, setTab] = useState<'catalog' | 'coins'>('catalog');

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((data: CatalogItem[]) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    return items;
  }, [catalog, search, filters]);

  const owned: string[] = (account?.owned as string[]) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">Marketplace</h1>
        <p className="text-slate-400">Browse characters, pets, outfits, and more for your PixelPlush games.</p>
        {isLoggedIn && account && (
          <p className="mt-2 text-sm text-yellow-400">
            <Image src="/app-assets/images/icon/plush_coin.gif" alt="coins" width={20} height={20} className="pixelated mr-1 inline" unoptimized />
            {account.coins} coins
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setTab('catalog')}
          className={`rounded-lg px-5 py-2 font-medium transition ${
            tab === 'catalog' ? 'bg-[var(--color-pp-accent)] text-white' : 'bg-[var(--color-pp-card)] text-slate-400 hover:bg-[var(--color-pp-card-hover)]'
          }`}
        >
          Item Catalog
        </button>
        <button
          onClick={() => setTab('coins')}
          className={`rounded-lg px-5 py-2 font-medium transition ${
            tab === 'coins' ? 'bg-[var(--color-pp-accent)] text-white' : 'bg-[var(--color-pp-card)] text-slate-400 hover:bg-[var(--color-pp-card-hover)]'
          }`}
        >
          Buy Coins
        </button>
      </div>

      {tab === 'coins' ? (
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.coins}
                className={`relative rounded-2xl border p-6 text-center transition ${
                  pkg.value === 'Best Value'
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-[var(--color-pp-border)] bg-[var(--color-pp-card)]'
                }`}
              >
                {pkg.value && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-bold text-black">
                    {pkg.value}
                  </span>
                )}
                <div className="mb-2 text-3xl font-bold text-white">
                  <Image src="/app-assets/images/icon/plush_coin.gif" alt="coins" width={28} height={28} className="pixelated mr-2 inline" unoptimized />
                  {pkg.coins.toLocaleString()}
                </div>
                <div className="mb-4 text-lg text-slate-400">{pkg.price}</div>
                {isLoggedIn ? (
                  <button className="w-full rounded-lg bg-[var(--color-pp-accent)] py-2.5 font-medium text-white transition hover:bg-[#4a7de0]">
                    Purchase
                  </button>
                ) : (
                  <p className="text-sm text-slate-500">Log in to purchase</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Payments processed securely via PayPal. Coins are non-refundable.
          </p>
        </div>
      ) : (
        <>
          {/* Search & Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-4 py-2.5 text-white placeholder-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none sm:w-64"
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
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-slate-500">No items found</div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredItems.map((item) => {
                const isOwned = owned.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl border p-3 text-center transition ${
                      isOwned ? 'border-green-500/30 bg-green-500/5' : 'border-[var(--color-pp-border)] bg-[var(--color-pp-card)] hover:border-[var(--color-pp-accent)]/30'
                    }`}
                  >
                    <div className="mb-2 flex h-20 items-center justify-center">
                      <Image
                        src={getItemPreview(item)}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="pixelated"
                        unoptimized
                      />
                    </div>
                    <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[item.type] || 'bg-white/10 text-slate-400'}`}>
                      {item.type}
                    </span>
                    <h3 className="text-xs font-medium text-white truncate">{item.name}</h3>
                    <div className="mt-1.5">
                      {isOwned ? (
                        <span className="text-xs text-green-400">Owned</span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          <Image src="/app-assets/images/icon/plush_coin.gif" alt="" width={14} height={14} className="pixelated mr-0.5 inline" unoptimized />
                          {item.sale ? (
                            <>
                              <span className="line-through">{item.cost}</span>{' '}
                              <span className="text-green-400">{Math.floor(item.cost / 2)}</span>
                            </>
                          ) : item.cost === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            item.cost
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
