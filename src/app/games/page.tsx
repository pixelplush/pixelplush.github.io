'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';

const games = [
  {
    id: 'giveaway',
    name: 'Giveaway Tool',
    tagline: 'Fun way to do giveaways on Twitch',
    description: 'Run giveaways in an easy and fun way for your viewers! Viewers type a command in chat to enter, and a random winner is picked with a fun animation.',
    images: ['/app-assets/images/games/giveaway_basic.gif', '/app-assets/images/games/giveaway_blossoms.gif', '/app-assets/images/games/giveaway_autumn.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: true,
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
    hasThemes: false,
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
    hasThemes: false,
  },
  {
    id: 'plinko',
    name: 'Plinko Bounce',
    tagline: 'Plinko stream overlay game for Twitch',
    description: 'Drop a ball and watch it bounce through pegs to score points! Viewers compete for the highest score on the leaderboard.',
    images: ['/app-assets/images/games/plinko_christmas_website.gif', '/app-assets/images/games/pixelplinkohalloween.gif', '/app-assets/images/games/plinko_day_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: true,
  },
  {
    id: 'parachute',
    name: 'Parachute Drop',
    tagline: 'Parachute stream overlay game for Twitch',
    description: 'Jump out of a plane, open your parachute, and try to land on the target! Viewers compete by typing commands in chat.',
    images: ['/app-assets/images/games/drop_cauldron_rainbow_website.gif', '/app-assets/images/games/drop_christmas.gif', '/app-assets/images/games/drop_cake_rainbow_website.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: true,
  },
  {
    id: 'chatflakes',
    name: 'Chat Flakes',
    tagline: 'Chat messages turned into stream particles',
    description: 'Viewers add subtle particle effects across your screen just by typing in chat. A beautiful passive overlay!',
    images: ['/app-assets/images/games/chatflakes.gif'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: false,
  },
  {
    id: 'hillroll',
    name: 'Hill Rolling Race',
    tagline: 'Racing stream overlay game for Twitch',
    description: 'Roll down a hill and race against other viewers! Dodge obstacles and try to reach the finish line first.',
    images: ['/app-assets/images/games/hill_christmas_gif.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: true,
  },
  {
    id: 'maze',
    name: 'Pixel Maze',
    tagline: 'Stream maze game for Twitch',
    description: 'Navigate through a maze using chat commands! Great for BRB screens — keeps your viewers entertained during breaks.',
    images: ['/app-assets/images/games/maze_christmas_gif.gif', '/app-assets/images/games/maze_winter_gif.gif', '/app-assets/images/games/wanderingwizards.gif'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'Free',
    badgeColor: 'bg-green-500/20 text-green-400',
    hasThemes: true,
  },
];

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

            {selectedGame.hasThemes && selectedGame.images.length > 1 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-[var(--color-pp-text-muted)]">Available Themes</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedGame.images.map((img, i) => (
                    <div key={i} className="h-20 w-20 overflow-hidden rounded-lg border border-[var(--color-pp-border)]">
                      <Image src={assetPath(img)} alt={`Theme ${i + 1}`} width={80} height={80} className="pixelated h-full w-full object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/customize"
                className="rounded-lg bg-[var(--color-pp-accent)] px-6 py-2.5 font-medium text-white transition hover:bg-[#4a7de0]"
              >
                Set Up This Game
              </Link>
              <Link
                href={`/scores?game=${selectedGame.id === 'parachute' ? 'parachute' : selectedGame.id}`}
                className="rounded-lg border border-[var(--color-pp-border)] px-6 py-2.5 font-medium text-[var(--color-pp-text-muted)] transition hover:border-[var(--color-pp-text)]"
              >
                View Leaderboard
              </Link>
            </div>
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
            className={`group rounded-2xl border p-5 transition hover:scale-[1.02] hover:shadow-lg ${game.color}`}
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
