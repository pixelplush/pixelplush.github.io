"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/scores", label: "Scores" },
  { href: "/market", label: "Market" },
  { href: "/customize", label: "Dressing Room" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-pp-darker)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/app-assets/images/logo/logo.png" alt="PixelPlush" width={40} height={40} className="pixelated" />
          <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">PixelPlush</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-purple-600/20 text-purple-300" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="hidden sm:block h-9 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : isLoggedIn && account ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                {account.profileImage ? (
                  <Image src={account.profileImage} alt="" width={28} height={28} className="rounded-full" unoptimized />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                    {(account.displayName || account.username || "?")[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{account.displayName || account.username}</span>
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--color-pp-card)] border border-white/10 shadow-xl py-1 z-50">
                  {account.coins !== undefined && (
                    <div className="px-4 py-2 text-xs text-yellow-400 border-b border-white/10">{account.coins} coins</div>
                  )}
                  <Link href="/customize" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setUserMenuOpen(false)}>Dressing Room</Link>
                  <Link href="/transactions" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setUserMenuOpen(false)}>My Transactions</Link>
                  <Link href="/redeem" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setUserMenuOpen(false)}>Redeem Code</Link>
                  <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10">Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={login} className="hidden sm:inline-flex rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
              Log in with Twitch
            </button>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white" aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="mt-2 block w-full rounded-lg bg-red-600/80 px-3 py-2 text-center text-base font-semibold text-white">Log Out</button>
          ) : (
            <button onClick={() => { login(); setMobileOpen(false); }} className="mt-2 block w-full rounded-lg bg-purple-600 px-3 py-2 text-center text-base font-semibold text-white">Log in with Twitch</button>
          )}
        </nav>
      )}
    </header>
  );
}
