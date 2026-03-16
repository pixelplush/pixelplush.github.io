import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redeem Code',
  description: 'Redeem a PixelPlush code to unlock characters, pets, coins, and other goodies.',
  alternates: { canonical: '/redeem' },
};

export default function RedeemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
