import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games for Streams',
  description: 'Browse all PixelPlush stream overlay games for Twitch — Parachute, Plinko, Maze, Giveaway Tool, Confetti, and more.',
  alternates: { canonical: '/games' },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
