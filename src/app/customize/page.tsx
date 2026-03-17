'use client';

import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

const CATALOG_URL = 'https://www.pixelplush.dev/assets/catalog.json';
const STATS_URL = 'https://stats.pixelplush.dev/v1';

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

const categories = [
  { key: 'character', label: 'Characters' },
  { key: 'pet', label: 'Pets' },
  { key: 'body', label: 'Body' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'outfit', label: 'Outfits' },
  { key: 'effect', label: 'Effects' },
] as const;

function getItemPreview(item: CatalogItem, frame = 0): string {
  if (item.theme === 'None') return '';
  let dir = '';
  switch (item.type) {
    case 'bundle':
      return `https://www.pixelplush.dev/assets/bundles/${item.path}`;
    case 'add-on':
      return `https://www.pixelplush.dev/assets/add-ons/${item.path}`;
    case 'pet':
      dir = `pets/${item.path}`;
      break;
    case 'body':
      dir = `skins/body/${item.category}/${item.path}`;
      break;
    case 'equipment':
      dir = `skins/equipment/${item.category}/${item.path}`;
      break;
    case 'accessory':
      dir = `skins/accessories/${item.category}/${item.path}`;
      break;
    case 'outfit':
      dir = `skins/outfits/${item.category}/${item.path}`;
      break;
    case 'effect':
      dir = `skins/effects/${item.path}`;
      break;
    default:
      dir = `${item.type}s/${item.id}`;
      break;
  }
  const animFrame = (frame % 10) + 1;
  const directions = ['front', 'left', 'back', 'right'];
  const direction = directions[Math.floor((frame % 80) / 20)];
  return `https://www.pixelplush.dev/assets/${dir}/${item.path}_${direction}/${item.path}_${direction}${animFrame}.png`;
}

export default function CustomizePage() {
  const { isLoggedIn, isLoading, token, account, login, refreshAccount } = useAuth();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('character');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [animFrame, setAnimFrame] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch(CATALOG_URL)
      .then((r) => r.json())
      .then((data: CatalogItem[]) => {
        setCatalog(data);
        setCatalogLoading(false);
      })
      .catch(() => setCatalogLoading(false));
  }, []);

  // Animation on hover
  useEffect(() => {
    if (hoveredItem) {
      setAnimFrame(0);
      animRef.current = setInterval(() => setAnimFrame((f) => f + 1), 100);
    } else {
      if (animRef.current) clearInterval(animRef.current);
      setAnimFrame(0);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [hoveredItem]);

  const catalogMap = useMemo(() => {
    const map: Record<string, CatalogItem> = {};
    catalog.forEach((item) => { map[item.id] = item; });
    return map;
  }, [catalog]);

  const owned = useMemo(() => new Set(account?.owned || []), [account]);
  const style = account?.style as Record<string, string> | undefined;
  const styles = account?.styles as Record<string, string[]> | undefined;

  const getItemStatus = useCallback((item: CatalogItem): 'selected' | 'queued' | 'owned' | 'unowned' => {
    const cat = item.category || item.type;
    if (style && style[cat] === item.id) return 'selected';
    if (styles && styles[cat]?.includes(item.id)) return 'queued';
    if (owned.has(item.id)) return 'owned';
    return 'unowned';
  }, [style, styles, owned]);

  const ownedItems = useMemo(() => {
    return catalog
      .filter((item) => !item.hidden && owned.has(item.id))
      .filter((item) => item.type === activeCategory)
      .filter((item) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.theme.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const sa = getItemStatus(a);
        const sb = getItemStatus(b);
        const order = { selected: 0, queued: 1, owned: 2, unowned: 3 };
        return order[sa] - order[sb];
      });
  }, [catalog, owned, activeCategory, search, getItemStatus]);

  const selectItem = async (itemId: string) => {
    if (!token || busy) return;
    setBusy(itemId);
    try {
      await fetch(`${STATS_URL}/accounts/design/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Twitch: token },
        body: JSON.stringify({ item: itemId }),
      });
      await refreshAccount();
    } catch { /* ignore */ }
    setBusy(null);
  };

  const unselectItem = async (itemId: string) => {
    if (!token || busy) return;
    setBusy(itemId);
    try {
      await fetch(`${STATS_URL}/accounts/design/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Twitch: token },
        body: JSON.stringify({ item: itemId, remove: true }),
      });
      await refreshAccount();
    } catch { /* ignore */ }
    setBusy(null);
  };

  const deselectAll = async () => {
    if (!token || busy) return;
    setBusy('deselect-all');
    try {
      await fetch(`${STATS_URL}/accounts/design/unset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Twitch: token },
        body: JSON.stringify({ item: 'coin_remove' }),
      });
      await fetch(`${STATS_URL}/accounts/design/unset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Twitch: token },
        body: JSON.stringify({ item: 'pet_none' }),
      });
      await fetch(`${STATS_URL}/accounts/design/unset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Twitch: token },
        body: JSON.stringify({ item: 'outfit_skin1' }),
      });
      await refreshAccount();
    } catch { /* ignore */ }
    setBusy(null);
  };

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
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">Dressing Room</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">Log in with Twitch to customize your character, equip outfits, and manage your pet.</p>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 rounded-lg bg-[#9146FF] px-6 py-3 font-medium text-white transition hover:bg-[#7c3aed]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
            Log in with Twitch
          </button>
        </div>
      </div>
    );
  }

  // Get currently selected items for preview
  const selectedCharId = style?.character;
  const selectedPetId = style?.pet;
  const selectedChar = selectedCharId ? catalogMap[selectedCharId] : null;
  const selectedPet = selectedPetId ? catalogMap[selectedPetId] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">Dressing Room</h1>
          <p className="mt-1 text-[var(--color-pp-text-muted)]">Select items to use in PixelPlush games.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={deselectAll}
            disabled={!!busy}
            className="rounded-lg border border-[var(--color-pp-danger)]/30 px-4 py-2 text-sm font-medium text-[var(--color-pp-danger)] transition hover:bg-[var(--color-pp-danger)]/10 disabled:opacity-50"
          >
            Deselect All
          </button>
          <Link
            href="/market"
            className="rounded-lg border border-[var(--color-pp-border)] px-4 py-2 text-sm font-medium text-[var(--color-pp-text-muted)] transition hover:border-[var(--color-pp-text)]"
          >
            Visit Market &rarr;
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Character Preview */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-pp-headings)]">Current Look</h2>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-[var(--color-pp-bg)]/50 p-4">
            {selectedChar ? (
              <div className="text-center">
                <Image
                  src={getItemPreview(selectedChar)}
                  alt={selectedChar.name}
                  width={64}
                  height={64}
                  className="pixelated mx-auto"
                  unoptimized
                />
                <p className="mt-2 text-xs font-medium text-[var(--color-pp-text)]">{selectedChar.name}</p>
              </div>
            ) : (
              <div className="text-center text-[var(--color-pp-text-muted)]">
                <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-[var(--color-pp-border)]" />
                <p className="text-xs">No character selected</p>
              </div>
            )}
            {selectedPet ? (
              <div className="text-center">
                <Image
                  src={getItemPreview(selectedPet)}
                  alt={selectedPet.name}
                  width={40}
                  height={40}
                  className="pixelated mx-auto"
                  unoptimized
                />
                <p className="mt-1 text-xs text-[var(--color-pp-text-muted)]">{selectedPet.name}</p>
              </div>
            ) : null}
          </div>

          {/* Quick summary of active items */}
          {style && Object.keys(style).length > 0 && (
            <div className="mt-4 space-y-1">
              <h3 className="text-xs font-medium text-[var(--color-pp-text-muted)]">Equipped</h3>
              {Object.entries(style).map(([cat, itemId]) => {
                const item = catalogMap[itemId as string];
                if (!item) return null;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-[var(--color-pp-text-muted)]">{cat}</span>
                    <span className="font-medium text-[var(--color-pp-text)]">{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Tabs + Items */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
            {/* Search + Category tabs */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search owned items..."
                className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-sm text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none sm:w-48"
              />
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      activeCategory === cat.key
                        ? 'bg-[var(--color-pp-accent)] text-white'
                        : 'bg-[var(--color-pp-bg)]/50 text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            {catalogLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" />
              </div>
            ) : ownedItems.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-center">
                <div className="text-[var(--color-pp-text-muted)]">
                  <p className="text-sm">No items in this category.</p>
                  <p className="mt-1 text-xs">
                    Visit the <Link href="/market" className="text-[var(--color-pp-link)] hover:underline">marketplace</Link> to get some!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ownedItems.map((item) => {
                  const status = getItemStatus(item);
                  const isHovered = hoveredItem === item.id;
                  const isBusy = busy === item.id;
                  const showSelect = item.type !== 'add-on' && item.type !== 'bundle';

                  return (
                    <div
                      key={item.id}
                      className={`group relative rounded-xl border p-3 text-center transition ${
                        status === 'selected'
                          ? 'border-green-500/40 bg-green-500/10'
                          : status === 'queued'
                            ? 'border-[var(--color-pp-accent)]/30 bg-[var(--color-pp-accent)]/5'
                            : 'border-[var(--color-pp-border)] bg-[var(--color-pp-card)]'
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {status === 'selected' && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-bold text-white">
                          ACTIVE
                        </span>
                      )}
                      {status === 'queued' && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-pp-accent)] px-2 py-0.5 text-[9px] font-bold text-white">
                          QUEUED
                        </span>
                      )}

                      <div className="mb-2 flex h-16 items-center justify-center">
                        <Image
                          src={getItemPreview(item, isHovered ? animFrame : 0)}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="pixelated"
                          unoptimized
                        />
                      </div>

                      <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-medium capitalize ${typeColors[item.type] || 'bg-white/10 text-[var(--color-pp-text-muted)]'}`}>
                        {item.type}
                      </span>
                      <h3 className="text-[11px] font-medium text-[var(--color-pp-headings)] truncate">{item.name}</h3>

                      {showSelect && (
                        <div className="mt-2">
                          {status === 'selected' || status === 'queued' ? (
                            <button
                              onClick={() => unselectItem(item.id)}
                              disabled={isBusy}
                              className="w-full rounded-md border border-[var(--color-pp-danger)]/30 px-2 py-1 text-[10px] font-medium text-[var(--color-pp-danger)] transition hover:bg-[var(--color-pp-danger)]/10 disabled:opacity-50"
                            >
                              {isBusy ? '...' : 'Unselect'}
                            </button>
                          ) : (
                            <button
                              onClick={() => selectItem(item.id)}
                              disabled={isBusy}
                              className="w-full rounded-md bg-[var(--color-pp-accent)] px-2 py-1 text-[10px] font-medium text-white transition hover:bg-[#4a7de0] disabled:opacity-50"
                            >
                              {isBusy ? '...' : 'Select'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
