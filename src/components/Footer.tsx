"use client";

import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { useTranslation } from "@/i18n";

export function Footer() {
  const { t, locale, setLocale, languages } = useTranslation();

  return (
    <footer className="mt-auto border-t border-[var(--color-pp-border)] bg-[var(--color-pp-footer)] px-4 py-4 sm:px-6">
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
          {/* Language switcher */}
          <div className="flex items-center gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`text-base leading-none px-1 py-0.5 rounded transition-opacity ${
                  locale === lang.code ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
                title={lang.name}
              >
                {lang.flag}
              </button>
            ))}
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
