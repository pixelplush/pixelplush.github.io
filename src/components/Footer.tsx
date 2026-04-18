"use client";

import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { useTranslation } from "@/i18n";

export function Footer() {
  const { t } = useTranslation();

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
