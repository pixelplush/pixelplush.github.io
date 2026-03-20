"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { assetPath } from "@/lib/assetPath";

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoading, isLoggedIn, account, login, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-pp-card)] border-b border-[var(--color-pp-border)]">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left side: Logo + text + creators */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={assetPath("/app-assets/images/logo/logo.png")}
              alt="PixelPlush"
              width={36}
              height={36}
              className="pixelated"
              unoptimized
            />
            <Image
              src={assetPath("/app-assets/images/logo/text.png")}
              alt="PixelPlush"
              width={120}
              height={24}
              className="hidden sm:block"
              unoptimized
            />
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1 text-xs text-[#4f2727]">
            ❤ By{" "}
            <a
              href="https://twitch.tv/maaya"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors"
            >
              Maaya
            </a>{" "}
            &amp;{" "}
            <a
              href="https://twitch.tv/instafluff"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--color-pp-link)] hover:text-[#8B4513] transition-colors"
            >
              Instafluff
            </a>
          </span>
        </div>

        {/* Right side: Auth */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-[var(--color-pp-surface)]" />
          ) : isLoggedIn && account ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-[var(--color-pp-headings)] hover:bg-[var(--color-pp-card-hover)] transition-colors"
              >
                {account.profileImage ? (
                  <Image src={account.profileImage} alt="" width={28} height={28} className="rounded-full" unoptimized />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-[var(--color-pp-accent)] flex items-center justify-center text-xs font-bold text-white">
                    {(account.displayName || account.username || "?")[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">{account.displayName || account.username}</span>
                {account.coins !== undefined && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[var(--color-pp-warning)]">
                    <Image
                      src={assetPath("/app-assets/images/icon/plush_coin.gif")}
                      alt="coins"
                      width={24}
                      height={24}
                      className="pixelated"
                      unoptimized
                    />
                    <strong>{account.coins}</strong>
                  </span>
                )}
                <svg className="h-4 w-4 text-[var(--color-pp-text)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 rounded-md bg-[var(--color-pp-card)] border border-[var(--color-pp-border)] shadow-lg py-1 z-50">
                  <Link href="/customize" className="block px-4 py-2 text-sm text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)] hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    My Dressing Room
                  </Link>
                  <Link href="/transactions" className="block px-4 py-2 text-sm text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)] hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    My Shopping History
                  </Link>
                  <Link href="/market" className="block px-4 py-2 text-sm text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)] hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    Goodies Market
                  </Link>
                  <a href="https://discord.gg/pixelplush" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)] hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    PixelPlush Discord
                  </a>
                  <Link href="/redeem" className="block px-4 py-2 text-sm text-[var(--color-pp-text)] hover:bg-[var(--color-pp-card-hover)] hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    Redeem Code
                  </Link>
                  <div className="border-t border-[var(--color-pp-border)] my-1"></div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-pp-danger)] hover:bg-[var(--color-pp-card-hover)]"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="btn btn-primary rounded px-4 py-2 text-sm font-semibold"
            >
              Log in with Twitch
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
