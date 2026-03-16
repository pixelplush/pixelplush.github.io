import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goodies Market',
  description: 'Get special characters, pets, and outfits for your PixelPlush stream games. Spend coins earned from playing!',
  alternates: { canonical: '/market' },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
