import type { Metadata } from 'next';
import Image from 'next/image';
import { assetPath } from '@/lib/assetPath';

export const metadata: Metadata = {
  title: 'Links',
  description: 'PixelPlush social media links, banners, and community resources.',
  alternates: { canonical: '/links' },
};

const socialLinks = [
  {
    name: 'Discord',
    url: 'https://discord.gg/pixelplush',
    description: 'Join the community — get help, share clips, hang out.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
    color: 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30',
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/pixelplushgames',
    description: 'Updates, patch notes, and game announcements.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-slate-500/20 text-slate-300 hover:bg-slate-500/30',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/pixelplushgames',
    description: 'Behind-the-scenes, pixel art, and community highlights.',
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
  },
];

const banners = [
  { src: '/app-assets/images/pages/banner1.png', alt: 'PixelPlush Banner 1' },
  { src: '/app-assets/images/pages/banner2.png', alt: 'PixelPlush Banner 2' },
  { src: '/app-assets/images/pages/banner3.png', alt: 'PixelPlush Banner 3' },
];

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-pp-headings)]">Links &amp; Community</h1>
      <p className="mb-8 text-[var(--color-pp-text-muted)]">Find us on social media and get banners for your stream.</p>

      {/* Social Links */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-pp-border)] p-6 text-center transition ${link.color}`}
          >
            {link.icon}
            <span className="text-lg font-semibold text-[var(--color-pp-headings)]">{link.name}</span>
            <span className="text-sm text-[var(--color-pp-text-muted)]">{link.description}</span>
          </a>
        ))}
      </div>

      {/* Banners */}
      <div className="rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] p-6">
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-pp-headings)]">Stream Banners</h2>
        <p className="mb-6 text-sm text-[var(--color-pp-text-muted)]">
          Want to show your support? Use these banners in your panels or overlays!
        </p>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.src} className="overflow-hidden rounded-lg border border-white/5">
              <Image
                src={assetPath(banner.src)}
                alt={banner.alt}
                width={800}
                height={200}
                className="w-full object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
