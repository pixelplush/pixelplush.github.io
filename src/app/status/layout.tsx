import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Check the current status of PixelPlush game servers and services.',
  alternates: { canonical: '/status' },
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
