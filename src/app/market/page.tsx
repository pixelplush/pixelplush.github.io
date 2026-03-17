'use client';

import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { assetPath } from '@/lib/assetPath';

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
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Marketplace</h1>
        <p className="text-[var(--color-pp-text-muted)]">Browse characters, pets, outfits, and more for your PixelPlush games.</p>
        {isLoggedIn && account && (
          <p className="mt-2 text-sm text-[var(--color-pp-text)]">
            <Image src={assetPath("/app-assets/images/icon/plush_coin.gif")} alt="coins" width={20} height={20} className="pixelated mr-1 inline" unoptimized />
            {account.coins} coins
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setTab('catalog')}
          className={`rounded-lg px-5 py-2 font-medium transition ${
            tab === 'catalog' ? 'bg-[var(--color-pp-accent)] text-white' : 'bg-[var(--color-pp-card)] text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)]'
          }`}
        >
          Item Catalog
        </button>
        <button
          onClick={() => setTab('coins')}
          className={`rounded-lg px-5 py-2 font-medium transition ${
            tab === 'coins' ? 'bg-[var(--color-pp-accent)] text-white' : 'bg-[var(--color-pp-card)] text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)]'
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
                <div className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">
                  <Image src={assetPath("/app-assets/images/icon/plush_coin.gif")} alt="coins" width={28} height={28} className="pixelated mr-2 inline" unoptimized />
                  {pkg.coins.toLocaleString()}
                </div>
                <div className="mb-4 text-lg text-[var(--color-pp-text-muted)]">{pkg.price}</div>
                {isLoggedIn ? (
                  <button className="w-full rounded-lg bg-[var(--color-pp-accent)] py-2.5 font-medium text-white transition hover:bg-[#4a7de0]">
                    Purchase
                  </button>
                ) : (
                  <p className="text-sm text-[var(--color-pp-text-muted)]">Log in to purchase</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[var(--color-pp-text-muted)]">
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
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-[var(--color-pp-text-muted)]">No items found</div>
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
                    <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[item.type] || 'bg-[var(--color-pp-bg)]/50 text-[var(--color-pp-text-muted)]'}`}>
                      {item.type}
                    </span>
                    <h3 className="text-xs font-medium text-[var(--color-pp-headings)] truncate">{item.name}</h3>
                    <div className="mt-1.5">
                      {isOwned ? (
                        <span className="text-xs font-medium text-[var(--color-pp-success)]">Owned</span>
                      ) : (
                        <span className="text-xs text-[var(--color-pp-text-muted)]">
                          <Image src={assetPath("/app-assets/images/icon/plush_coin.gif")} alt="" width={14} height={14} className="pixelated mr-0.5 inline" unoptimized />
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
