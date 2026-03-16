import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Scores',
  description: 'View top scores and leaderboards for PixelPlush stream games.',
  alternates: { canonical: '/scores' },
};

export default function ScoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
