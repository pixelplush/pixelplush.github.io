import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Troubleshoot',
  description: 'Diagnose and fix common issues with PixelPlush stream overlay games in OBS.',
  alternates: { canonical: '/troubleshoot' },
};

export default function TroubleshootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
