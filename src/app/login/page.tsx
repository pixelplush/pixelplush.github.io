'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assetPath } from '@/lib/assetPath';
import { useTranslation } from '@/i18n';

const screenshots = [
  '/app-assets/images/games/pixelparachuteeaster.gif',
  '/app-assets/images/games/hillrollchristmas.gif',
  '/app-assets/images/games/pixelplinko.gif',
  '/app-assets/images/games/easteregghunt.gif',
];

export default function LoginPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isLoading, login } = useAuth();
  const router = useRouter();
  const [randomImage] = useState(() => assetPath(screenshots[Math.floor(Math.random() * screenshots.length)]));

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/');
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-pp-border)] bg-[var(--color-pp-card)] shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left — Login */}
          <div className="flex flex-col items-center justify-center p-8 md:p-12">
            <Image src={assetPath("/app-assets/images/logo/logo.png")} alt="PixelPlush" width={64} height={64} className="pixelated mb-6" />
            <h1 className="mb-2 text-2xl font-bold text-[var(--color-pp-headings)] text-center">{t("login.title")}</h1>
            <p className="mb-8 text-sm text-[var(--color-pp-text-muted)] text-center">{t("login.subtitle")}</p>

            <button
              onClick={login}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#9146FF] px-6 py-3 text-base font-semibold text-white hover:bg-[#772CE8] transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              {t("login.twitchButton")}
            </button>

            <p className="mt-6 text-xs text-slate-500 text-center">
              {t("login.helloFrom")} <span className="text-pink-400">Maaya</span> &amp; <span className="text-[var(--color-pp-accent)]">Instafluff</span>!
            </p>
          </div>

          {/* Right — Game image */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-purple-600/20 p-8">
            <Image
              src={randomImage}
              alt="PixelPlush Game"
              width={400}
              height={400}
              className="pixelated rounded-xl"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
