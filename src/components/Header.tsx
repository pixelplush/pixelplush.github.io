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
                <div className="absolute right-0 mt-1 w-56 rounded-lg bg-white border border-gray-200 shadow-xl py-1.5 z-50">
                  <Link href="/customize" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    My Dressing Room
                  </Link>
                  <Link href="/transactions" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    My Shopping History
                  </Link>
                  <Link href="/market" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                    Goodies Market
                  </Link>
                  <a href="https://discord.gg/pixelplush" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" /></svg>
                    PixelPlush Discord
                  </a>
                  <Link href="/redeem" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-pp-accent)]" onClick={() => setUserMenuOpen(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                    Redeem Code
                  </Link>
                  <div className="border-t border-gray-200 my-1.5"></div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-sm text-[var(--color-pp-danger)] hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
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
