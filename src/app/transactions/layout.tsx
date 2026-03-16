import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping History',
  description: 'View your PixelPlush purchase history and transaction details.',
  alternates: { canonical: '/transactions' },
};

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
