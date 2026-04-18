'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from '@/i18n';

const CATALOG_URL = 'https://www.pixelplush.dev/assets/catalog.json';
const STATS_URL = 'https://stats.pixelplush.dev/v1';
const ASSETS_BASE = 'https://www.pixelplush.dev/assets';

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

// Layer compositing order matching in-game PIXI z-ordering
const LAYER_ORDER: { type: string; categories: string[] }[] = [
  { type: 'body', categories: ['skintones'] },           // z+0: skin base
  { type: 'body', categories: ['expressions'] },          // z+1: face
  { type: 'accessory', categories: ['hair'] },            // z+2: hair (hidden by onesies)
  { type: 'outfit', categories: ['pants'] },              // z+3: pants
  { type: 'outfit', categories: ['shirts'] },             // z+4: shirts
  { type: 'outfit', categories: ['dresses', 'onesies'] }, // z+5: dresses/onesies
  { type: 'effect', categories: ['effects'] },            // z+5: effects
  { type: 'accessory', categories: ['glasses', 'masks', 'hats', 'wands'] }, // z+10: accessories
  { type: 'equipment', categories: ['wheelchairs'] },     // z+10: equipment
];

function getItemFrameUrl(item: CatalogItem, direction: string, frame: number): string {
  if (item.theme === 'None') return '';
  const f = (frame % 10) + 1;
  switch (item.type) {
    case 'bundle':
      return `${ASSETS_BASE}/bundles/${item.path}`;
    case 'add-on':
      return `${ASSETS_BASE}/add-ons/${item.path}`;
    case 'pet':
      return `${ASSETS_BASE}/pets/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    case 'body':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/body/${item.category}/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    case 'equipment':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/equipment/${item.category}/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    case 'accessory':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/accessories/${item.category}/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    case 'outfit':
      if (!item.category) return '';
      return `${ASSETS_BASE}/skins/outfits/${item.category}/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    case 'effect':
      return `${ASSETS_BASE}/skins/effects/${item.path}/${item.path}_${direction}/${item.path}_${direction}${f}.png`;
    default:
      return `${ASSETS_BASE}/${item.type}s/${item.id}/${item.id}_${direction}/${item.id}_${direction}${f}.png`;
  }
}

function getItemPreview(item: CatalogItem, frame = 0): string {
  const directions = ['front', 'left', 'back', 'right'];
  const direction = directions[Math.floor((frame % 80) / 20)];
  return getItemFrameUrl(item, direction, frame);
}

// ---- Layered Canvas Character Preview ----
function CharacterPreview({
  style,
  styles,
  catalogMap,
}: {
  style?: Record<string, string>;
  styles?: Record<string, string[]>;
  catalogMap: Record<string, CatalogItem>;
}) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<'front' | 'left' | 'back' | 'right'>('front');
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [queueIndex, setQueueIndex] = useState(0);
  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Resolve which items to show — matching the game engine's rendering logic:
  // 1. If skintones exist → body parts path (skip full character)
  // 2. If full character exists (no skintones) → character path (skip body parts)
  // 3. Accessories (hats/glasses/masks/wands) + effects always render on top
  // 4. Hair is hidden by onesies
  const resolvedItems = useMemo(() => {
    const items: { layer: number; item: CatalogItem }[] = [];
    if (!style && !styles) return items;

    // Helper: resolve one item per category from styles (queue cycling) or style (primary)
    function resolve(cat: string): CatalogItem | undefined {
      let itemId: string | undefined;
      if (styles?.[cat]?.length) {
        const q = styles[cat];
        itemId = q[queueIndex % q.length];
      }
      if (!itemId && style?.[cat]) {
        itemId = style[cat];
      }
      return itemId ? catalogMap[itemId] : undefined;
    }

    // Resolve key categories
    const character = resolve('character');
    const skintones = resolve('skintones');
    const hasOnesies = !!resolve('onesies');

    // Body part categories (only rendered when using individual parts, not full character)
    const bodyPartCats = ['skintones', 'expressions', 'hair', 'pants', 'shirts', 'dresses', 'onesies'];
    // Accessory categories (always rendered on top)
    const accessoryCats = ['glasses', 'hats', 'masks', 'wands'];
    // Effect categories (always rendered)
    const effectCats = ['effects'];

    if (skintones) {
      // === BODY PARTS PATH: render layered body parts, skip full character ===
      const bodyLayers: [string, number][] = [
        ['skintones', 0],
        ['expressions', 1],
        ['hair', 2],
        ['pants', 3],
        ['shirts', 4],
        ['dresses', 5],
        ['onesies', 5],
      ];
      for (const [cat, z] of bodyLayers) {
        if (cat === 'hair' && hasOnesies) continue; // Hair hidden by onesies
        const item = resolve(cat);
        if (item) items.push({ layer: z, item });
      }
    } else if (character) {
      // === FULL CHARACTER PATH: render only the character sprite ===
      items.push({ layer: 0, item: character });
    }

    // Accessories always render (z+10)
    for (const cat of accessoryCats) {
      const item = resolve(cat);
      if (item) items.push({ layer: 10, item });
    }

    // Effects always render (z+5)
    for (const cat of effectCats) {
      const item = resolve(cat);
      if (item) items.push({ layer: 5, item });
    }

    // Equipment (wheelchairs etc.)
    const equipment = resolve('wheelchairs');
    if (equipment) items.push({ layer: 10, item: equipment });

    // Pet — rendered beside the character
    let petId: string | undefined;
    if (styles?.pet?.length) {
      petId = styles.pet[queueIndex % styles.pet.length];
    }
    if (!petId && style?.pet) petId = style.pet;
    if (petId) {
      const petItem = catalogMap[petId];
      if (petItem) items.push({ layer: 100, item: petItem });
    }

    return items.sort((a, b) => a.layer - b.layer);
  }, [style, styles, catalogMap, queueIndex]);

  // Check if there are any queued items to cycle through
  const hasQueue = useMemo(() => {
    if (!styles) return false;
    return Object.values(styles).some((arr) => arr.length > 1);
  }, [styles]);

  const totalQueueSize = useMemo(() => {
    if (!styles) return 0;
    return Math.max(...Object.values(styles).map((arr) => arr.length), 0);
  }, [styles]);

  // Load image with caching
  const loadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    const cached = imgCacheRef.current.get(url);
    if (cached?.complete && cached?.naturalWidth > 0) return Promise.resolve(cached);
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgCacheRef.current.set(url, img);
        resolve(img);
      };
      img.onerror = () => resolve(img); // resolve anyway, just won't draw
      img.src = url;
    });
  }, []);

  // Draw composite character on canvas
  const drawFrame = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false; // pixel art!

    const characterLayers = resolvedItems.filter((i) => i.layer < 100);
    const petLayers = resolvedItems.filter((i) => i.layer >= 100);

    // Draw character layers at natural dimensions × scale, bottom-anchored
    // Matches game engine: sprites rendered at natural pixel size × 3, anchor.set(0.5, 1)
    const scale = 3;
    const charBottom = petLayers.length > 0 ? canvas.height - 50 : canvas.height - 20;

    for (const { item } of characterLayers) {
      const url = getItemFrameUrl(item, direction, frame);
      if (!url) continue;
      try {
        const img = await loadImage(url);
        if (img.naturalWidth > 0) {
          const drawW = img.naturalWidth * scale;
          const drawH = img.naturalHeight * scale;
          const drawX = (canvas.width - drawW) / 2;
          const drawY = charBottom - drawH;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
      } catch { /* skip broken images */ }
    }

    // Draw pet to the right, also at natural dimensions × scale, bottom-anchored
    if (petLayers.length > 0) {
      for (const { item } of petLayers) {
        const url = getItemFrameUrl(item, direction, frame);
        if (!url) continue;
        try {
          const img = await loadImage(url);
          if (img.naturalWidth > 0) {
            const drawW = img.naturalWidth * scale;
            const drawH = img.naturalHeight * scale;
            const drawX = canvas.width / 2 + 10;
            const drawY = charBottom - drawH;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
          }
        } catch { /* skip */ }
      }
    }
  }, [resolvedItems, direction, frame, loadImage]);

  // Animation loop
  useEffect(() => {
    if (playing) {
      animTimerRef.current = setInterval(() => setFrame((f) => f + 1), 120);
    } else {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
    }
    return () => { if (animTimerRef.current) clearInterval(animTimerRef.current); };
  }, [playing]);

  // Draw on every frame/direction change
  useEffect(() => {
    drawFrame();
  }, [drawFrame]);

  // Queue cycling (auto-advance every 4 seconds when there are queued items)
  useEffect(() => {
    if (!hasQueue) return;
    const timer = setInterval(() => setQueueIndex((i) => i + 1), 4000);
    return () => clearInterval(timer);
  }, [hasQueue]);

  const isEmpty = resolvedItems.length === 0;

  return (
    <div>
      <div className="relative rounded-lg bg-[var(--color-pp-bg)]/50 p-2">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={200}
          height={160}
          className="mx-auto block"
          style={{ imageRendering: 'pixelated' }}
        />

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-[var(--color-pp-text-muted)]">
            <div>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-[var(--color-pp-border)]" />
              <p className="text-xs">{t('customize.noItemsEquipped')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {!isEmpty && (
        <div className="mt-3 space-y-2">
          {/* Direction buttons */}
          <div className="flex items-center justify-center gap-1">
            {(['left', 'front', 'back', 'right'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => { setDirection(dir); setFrame(0); }}
                className={`rounded px-2 py-1 text-[10px] font-medium capitalize transition ${
                  direction === dir
                    ? 'bg-[var(--color-pp-accent)] text-white'
                    : 'bg-[var(--color-pp-bg)]/50 text-[var(--color-pp-text-muted)] hover:bg-[var(--color-pp-card-hover)]'
                }`}
              >
                {dir === 'front' ? '▼' : dir === 'back' ? '▲' : dir === 'left' ? '◄' : '►'}
              </button>
            ))}
            <button
              onClick={() => setPlaying(!playing)}
              className={`ml-2 rounded px-2 py-1 text-[10px] font-medium transition ${
                playing
                  ? 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]'
                  : 'bg-[var(--color-pp-bg)]/50 text-[var(--color-pp-text-muted)]'
              }`}
            >
              {playing ? '⏸' : '▶'}
            </button>
          </div>

          {/* Queue indicator */}
          {hasQueue && totalQueueSize > 1 && (
            <div className="text-center">
              <p className="text-[10px] text-[var(--color-pp-text-muted)]">
                Queue {(queueIndex % totalQueueSize) + 1}/{totalQueueSize}
                <button
                  onClick={() => setQueueIndex((i) => i + 1)}
                  className="ml-2 rounded bg-[var(--color-pp-bg)]/50 px-1.5 py-0.5 text-[9px] hover:bg-[var(--color-pp-card-hover)]"
                >
                  Next →
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomizePage() {
  const { t } = useTranslation();
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
          <h1 className="mb-3 text-2xl font-bold text-[var(--color-pp-headings)]">{t("customize.title")}</h1>
          <p className="mb-6 text-[var(--color-pp-text-muted)]">{t("customize.subtitle")}</p>
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{t("customize.title")}</h1>
          <p className="mt-1 text-[var(--color-pp-text-muted)]">Select items to use in PixelPlush games.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={deselectAll}
            disabled={!!busy}
            className="rounded-lg bg-[var(--color-pp-danger)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Deselect All
          </button>
          <Link
            href="/market"
            className="rounded-lg bg-[var(--color-pp-accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Visit Market &rarr;
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Character Preview */}
        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-pp-headings)]">{t('customize.preview')}</h2>
          <CharacterPreview style={style} styles={styles} catalogMap={catalogMap} />

          {/* Equipped items summary */}
          {style && Object.keys(style).length > 0 && (
            <div className="mt-4 space-y-1">
              <h3 className="text-xs font-medium text-[var(--color-pp-text-muted)]">{t('customize.equipped')}</h3>
              {Object.entries(style).map(([cat, itemId]) => {
                const item = catalogMap[itemId as string];
                if (!item) return null;
                const queueCount = styles?.[cat]?.length || 0;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-[var(--color-pp-text-muted)]">{cat}</span>
                    <span className="font-medium text-[var(--color-pp-text)]">
                      {item.name}
                      {queueCount > 1 && (
                        <span className="ml-1 text-[9px] text-[var(--color-pp-accent)]">+{queueCount - 1}</span>
                      )}
                    </span>
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
                placeholder={t('customize.searchOwned')}
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
                  <p className="text-sm">{t('customize.noItemsInCategory')}</p>
                  <p className="mt-1 text-xs">
                    {t('customize.visitMarketHelp')} <Link href="/market" className="text-[var(--color-pp-link)] hover:underline">{t('customize.marketplace')}</Link> {t('customize.toGetSome')}
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
                          {t('customize.active')}
                        </span>
                      )}
                      {status === 'queued' && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-pp-accent)] px-2 py-0.5 text-[9px] font-bold text-white">
                          {t('customize.queued')}
                        </span>
                      )}

                      <div className="mb-2 flex h-16 items-center justify-center">
                        {getItemPreview(item, isHovered ? animFrame : 0) ? (
                          <img
                            src={getItemPreview(item, isHovered ? animFrame : 0)}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="pixelated"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.item-placeholder')) {
                                const ph = document.createElement('div');
                                ph.className = 'item-placeholder flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--color-pp-border)] text-[var(--color-pp-text-muted)] text-xs font-bold';
                                ph.textContent = item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                                parent.appendChild(ph);
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--color-pp-border)] text-[var(--color-pp-text-muted)] text-xs font-bold">
                            {item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        )}
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
