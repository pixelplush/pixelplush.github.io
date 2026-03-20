'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';
import { useAuth } from '@/lib/auth';

interface GameTheme {
  key: string;
  name: string;
  page: string;
  premium?: boolean;
}

interface GameDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  color: string;
  badge: string;
  badgeColor: string;
  themes: GameTheme[];
}

const games: GameDef[] = [
  {
    id: 'giveaway',
    name: 'Giveaway Tool',
    tagline: 'Fun way to do giveaways on Twitch',
    description: 'Run giveaways in an easy and fun way for your viewers! Viewers type a command in chat to enter, and a random winner is picked with a fun animation.',
    images: ['/app-assets/images/games/giveaway_basic.gif', '/app-assets/images/games/giveaway_blossoms.gif', '/app-assets/images/games/giveaway_autumn.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'giveaway', name: 'PixelPlush (Free)', page: '/giveaway/index.html' },
      { key: 'giveawaycolors', name: 'Colorful (Premium)', page: '/giveaway/blue.html', premium: true },
      { key: 'giveawayblue', name: 'Blue', page: '/giveaway/blue.html', premium: true },
      { key: 'giveawaybw', name: 'Black & White', page: '/giveaway/bw.html', premium: true },
      { key: 'giveawaygreen', name: 'Green', page: '/giveaway/green.html', premium: true },
      { key: 'giveawayorange', name: 'Orange', page: '/giveaway/orange.html', premium: true },
      { key: 'giveawaypink', name: 'Pink', page: '/giveaway/pink.html', premium: true },
      { key: 'giveawaypurple', name: 'Purple', page: '/giveaway/purple.html', premium: true },
      { key: 'giveawayred', name: 'Red', page: '/giveaway/red.html', premium: true },
      { key: 'giveawayyellow', name: 'Yellow', page: '/giveaway/yellow.html', premium: true },
      { key: 'giveawayblossoms', name: 'Blossoms (Premium)', page: '/giveaway/blossoms.html', premium: true },
      { key: 'giveawayautumn', name: 'Autumn (Premium)', page: '/giveaway/autumn.html', premium: true },
    ],
  },
  {
    id: 'weather',
    name: 'Stream Weather',
    tagline: 'Weather overlay using Channel Points',
    description: 'A weather-changing stream overlay that viewers can control using Channel Points. Rain, snow, thunderstorms — your viewers decide!',
    images: ['/app-assets/images/games/streamweather_square.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Channel Points',
    badgeColor: 'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]',
    themes: [
      { key: 'weather', name: 'Stream Weather', page: '/weather/index.html', premium: true },
    ],
  },
  {
    id: 'confetti',
    name: 'Pixel Confetti',
    tagline: 'Stream confetti overlay using Channel Points',
    description: 'Viewers send confetti across your stream using Channel Points! A fun visual celebration for subs, raids, or any hype moment.',
    images: ['/app-assets/images/games/pixelconfetti_square.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Channel Points',
    badgeColor: 'bg-[var(--color-pp-accent)]/20 text-[var(--color-pp-accent)]',
    themes: [
      { key: 'confetti', name: 'Pixel Confetti', page: '/confetti/index.html', premium: true },
    ],
  },
  {
    id: 'plinko',
    name: 'Plinko Bounce',
    tagline: 'Plinko stream overlay game for Twitch',
    description: 'Drop a ball and watch it bounce through pegs to score points! Viewers compete for the highest score on the leaderboard.',
    images: ['/app-assets/images/games/plinko_christmas_website.gif', '/app-assets/images/games/pixelplinkohalloween.gif', '/app-assets/images/games/plinko_day_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelplinko', name: 'Day (Free)', page: '/plinko/index.html' },
      { key: 'pixelplinkochristmas', name: 'Christmas (Free)', page: '/plinko/christmas.html' },
      { key: 'pixelplinkohalloween', name: 'Halloween (Premium)', page: '/plinko/halloween.html', premium: true },
    ],
  },
  {
    id: 'parachute',
    name: 'Parachute Drop',
    tagline: 'Parachute stream overlay game for Twitch',
    description: 'Jump out of a plane, open your parachute, and try to land on the target! Viewers compete by typing commands in chat.',
    images: ['/app-assets/images/games/drop_cauldron_rainbow_website.gif', '/app-assets/images/games/drop_christmas.gif', '/app-assets/images/games/drop_cake_rainbow_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelparachutes', name: 'Day (Free)', page: '/parachute/index.html' },
      { key: 'pixelparachutesday', name: 'Day Alt', page: '/parachute/day.html' },
      { key: 'pixelparachutesnight', name: 'Night', page: '/parachute/night.html' },
      { key: 'pixelparachutesretro', name: 'Retro', page: '/parachute/retro.html' },
      { key: 'pixelparachuteautumn', name: 'Autumn (Free)', page: '/parachute/autumn.html' },
      { key: 'pixelparachutehalloween', name: 'Halloween (Free)', page: '/parachute/halloween.html' },
      { key: 'pixelparachutechristmas', name: 'Christmas (Free)', page: '/parachute/christmas.html' },
      { key: 'pixelparachutewinter', name: 'Winter (Free)', page: '/parachute/winter.html' },
      { key: 'pixelparachutespring', name: 'Spring Blossoms (Premium)', page: '/parachute/spring.html', premium: true },
      { key: 'pixelparachuterainbow', name: 'Rainbow (Premium)', page: '/parachute/pride.html', premium: true },
      { key: 'pixelparachutecauldron', name: 'Cauldron (Premium)', page: '/parachute/cauldron_colors.html', premium: true },
      { key: 'pixelparachutechristmaseve', name: 'Christmas Eve (Premium)', page: '/parachute/christmas_eve.html', premium: true },
      { key: 'pixelparachutevalentines', name: 'Valentines (Premium)', page: '/parachute/valentines_brown_gold.html', premium: true },
      { key: 'pixelparachuteeaster', name: 'Easter (Free)', page: '/parachute/easter_free.html' },
      { key: 'pixelparachutesplashpool', name: 'Pool Party Red (Free)', page: '/parachute/pool_splash_red.html' },
      { key: 'pixelparachutesplashpoolblue', name: 'Pool Party Blue (Free)', page: '/parachute/pool_splash_blue.html' },
      { key: 'pixelparachutescakes', name: 'Party Cakes (Premium)', page: '/parachute/cake_rainbow.html', premium: true },
    ],
  },
  {
    id: 'chatflakes',
    name: 'Chat Flakes',
    tagline: 'Chat messages turned into stream particles',
    description: 'Viewers add subtle particle effects across your screen just by typing in chat. A beautiful passive overlay!',
    images: ['/app-assets/images/games/chatflakes.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'chatflakes', name: 'Chat Flakes', page: '/flakes/index.html', premium: true },
    ],
  },
  {
    id: 'hillroll',
    name: 'Hill Rolling Race',
    tagline: 'Racing stream overlay game for Twitch',
    description: 'Roll down a hill and race against other viewers! Dodge obstacles and try to reach the finish line first.',
    images: ['/app-assets/images/games/hill_christmas_gif.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'pixelhillrollchristmas', name: 'Christmas (Free)', page: '/hillroll/christmas.html' },
    ],
  },
  {
    id: 'maze',
    name: 'Pixel Maze',
    tagline: 'Stream maze game for Twitch',
    description: 'Navigate through a maze using chat commands! Great for BRB screens — keeps your viewers entertained during breaks.',
    images: ['/app-assets/images/games/maze_christmas_gif.gif', '/app-assets/images/games/maze_winter_gif.gif', '/app-assets/images/games/wanderingwizards.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-[var(--color-pp-success)]/20 text-[var(--color-pp-success)]',
    themes: [
      { key: 'wanderingwizards', name: 'Wandering Wizards (Free)', page: '/maze/index.html' },
      { key: 'autumnadventure', name: 'Autumn Adventure (Free)', page: '/maze/autumn.html' },
      { key: 'trickortreat', name: 'Trick or Treat (Free)', page: '/maze/ghost.html' },
      { key: 'santasecretservice', name: 'Santa\'s Secret Service (Free)', page: '/maze/christmas.html' },
      { key: 'frozenfrenzy', name: 'Frozen Frenzy (Free)', page: '/maze/frozen.html' },
      { key: 'cupidheartcollection', name: 'Cupid Heart Collection (Free)', page: '/maze/cupid.html' },
      { key: 'easteregghunt', name: 'Easter Egg Hunt (Free)', page: '/maze/easter.html' },
      { key: 'springspree', name: 'Spring Spree (Free)', page: '/maze/spring.html' },
      { key: 'fairyforest', name: 'Fairy Forest (Free)', page: '/maze/fairy.html' },
    ],
  },
];

function LinkGenerator({ game }: { game: GameDef }) {
  const { isLoggedIn, account, token } = useAuth();
  const [channelName, setChannelName] = useState(account?.username || '');
  const [selectedTheme, setSelectedTheme] = useState(game.themes[0]?.key || '');
  const [copied, setCopied] = useState(false);

  const theme = game.themes.find((t) => t.key === selectedTheme) || game.themes[0];

  const generateUrl = useCallback(() => {
    if (!channelName.trim() || !theme) return '';
    const base = `https://www.pixelplush.dev${theme.page}`;
    const params = new URLSearchParams();
    params.set('channel', channelName.trim().toLowerCase());
    if (token) {
      params.set('oauth', token);
    }
    return `${base}?${params.toString()}`;
  }, [channelName, theme, token]);

  const url = generateUrl();

  const copyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--color-pp-border)] bg-[var(--color-pp-bg)]/50 p-5">
      <h3 className="mb-4 text-sm font-semibold text-[var(--color-pp-headings)]">Generate Browser Source Link</h3>

      <div className="space-y-4">
        {/* Channel name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Twitch Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value.toLowerCase())}
            placeholder="e.g. instafluff"
            className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-sm text-[var(--color-pp-text)] placeholder-[var(--color-pp-text-muted)] focus:border-[var(--color-pp-accent)] focus:outline-none"
          />
          {!isLoggedIn && (
            <p className="mt-1 text-[10px] text-[var(--color-pp-text-muted)]">
              <Link href="/login" className="text-[var(--color-pp-link)] hover:underline">Log in</Link> to auto-fill your channel and enable token-based features.
            </p>
          )}
        </div>

        {/* Theme selector */}
        {game.themes.length > 1 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Theme</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-sm text-[var(--color-pp-text)] focus:border-[var(--color-pp-accent)] focus:outline-none"
            >
              {game.themes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}{t.premium ? ' 💎' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Generated URL */}
        {channelName.trim() && (
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-pp-text-muted)]">Browser Source URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded-lg border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] px-3 py-2 text-xs text-[var(--color-pp-text-muted)] focus:outline-none"
              />
              <button
                onClick={copyUrl}
                className="shrink-0 rounded-lg bg-[var(--color-pp-accent)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#4a7de0]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg bg-[var(--color-pp-card)] p-3 text-[11px] text-[var(--color-pp-text-muted)]">
          <p className="font-medium text-[var(--color-pp-text)]">How to add to OBS:</p>
          <ol className="mt-1 list-inside list-decimal space-y-0.5">
            <li>Copy the URL above</li>
            <li>In OBS, add a new <strong>Browser Source</strong></li>
            <li>Paste the URL and set size to <strong>1920×1080</strong></li>
            <li>Check &quot;Refresh browser when scene becomes active&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function GamesContent() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type');
  const selectedGame = selectedType ? games.find((g) => g.id === selectedType) : null;

  if (selectedGame) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/games" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-pp-accent)] hover:underline">
          &larr; All Games
        </Link>

        <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] overflow-hidden">
          {/* Hero image */}
          <div className="relative h-64 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
            <Image
              src={assetPath(selectedGame.images[0])}
              alt={selectedGame.name}
              width={400}
              height={250}
              className="pixelated max-h-56 w-auto object-contain"
              unoptimized
            />
          </div>

          <div className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[var(--color-pp-headings)]">{selectedGame.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedGame.badgeColor}`}>
                {selectedGame.badge}
              </span>
            </div>
            <p className="mb-6 text-lg text-[var(--color-pp-text-muted)]">{selectedGame.description}</p>

            {/* Theme list */}
            {selectedGame.themes.length > 1 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-[var(--color-pp-text-muted)]">
                  Available Themes ({selectedGame.themes.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.themes.map((t) => (
                    <span
                      key={t.key}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        t.premium
                          ? 'bg-amber-600/15 text-amber-800'
                          : 'bg-[var(--color-pp-success)]/15 text-[var(--color-pp-success)]'
                      }`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Link Generator */}
            <LinkGenerator game={selectedGame} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Games &amp; Overlays</h1>
        <p className="text-[var(--color-pp-text-muted)]">
          Free Twitch chat-integrated games and overlays. Add them to OBS as browser sources.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games?type=${game.id}`}
            className={`group rounded-2xl border p-5 transition hover:scale-[1.02] hover:shadow-lg ${game.color} bg-[#FFFDF8]`}
          >
            <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-black/20">
              <Image
                src={assetPath(game.images[0])}
                alt={game.name}
                width={200}
                height={150}
                className="pixelated max-h-36 w-auto object-contain"
                unoptimized
              />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-[var(--color-pp-headings)] group-hover:text-[var(--color-pp-accent)]">{game.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-pp-text-muted)]">{game.tagline}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${game.badgeColor}`}>
                {game.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-pp-accent)] border-t-transparent" /></div>}>
      <GamesContent />
    </Suspense>
  );
}
