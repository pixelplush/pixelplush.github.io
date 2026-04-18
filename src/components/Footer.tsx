"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { assetPath } from "@/lib/assetPath";
import { useTranslation } from "@/i18n";

export function Footer() {
  const { t, locale, setLocale, languages } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currentLang = languages.find((l) => l.code === locale);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <footer className="sticky bottom-0 z-20 border-t border-[var(--color-pp-border)] bg-[var(--color-pp-footer)] px-4 py-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--color-pp-text)]">
        <div className="flex items-center gap-2">
          <Image
            src={assetPath("/app-assets/images/icon/discord.png")}
            alt="Discord"
            width={20}
            height={20}
            className="pixelated"
            unoptimized
          />
          <span>
            {t("footer.discordInvite")}{" "}
            <a
              href="https://pixelplush.dev/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-pp-accent)] transition-colors"
            >
              https://pixelplush.dev/discord
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--color-pp-card-hover)] transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>{currentLang?.name ?? "English"}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute bottom-full mb-1 right-0 w-40 rounded-lg bg-white border border-gray-200 shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${
                      locale === lang.code ? "font-semibold text-[var(--color-pp-accent)]" : "text-gray-700"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-[var(--color-pp-border)]">|</span>
          <Link href="/terms" className="hover:text-[var(--color-pp-accent)] transition-colors">
            {t("footer.terms")}
          </Link>
          <span className="text-[var(--color-pp-border)]">|</span>
          <Link href="/privacy" className="hover:text-[var(--color-pp-accent)] transition-colors">
            {t("footer.privacy")}
          </Link>
          <span className="text-[var(--color-pp-border)]">|</span>
          <span>
            &copy; {new Date().getFullYear()} PIXELPLUSH&trade;
          </span>
        </div>
      </div>
    </footer>
  );
}
