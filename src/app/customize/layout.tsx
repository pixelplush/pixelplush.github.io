import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Dressing Room',
  description: 'Customize your PixelPlush game characters, pets, and outfits. Set your active look across all stream games.',
  alternates: { canonical: '/customize' },
};

export default function CustomizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
