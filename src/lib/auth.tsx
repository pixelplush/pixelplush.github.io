'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    ComfyTwitch: {
      SetAuthEndpoint: (url: string) => void;
      SetRefreshEndpoint: (url: string) => void;
      Check: () => Promise<{ token: string; user?: Record<string, unknown> } | null>;
      Login: (clientId: string, redirectUrl: string, scopes: string[], responseType: string) => void;
      Logout: () => void;
    };
  }
}

const TWITCH_CLIENT_ID = '8m07ghhogjy0q09moeunnpdu51i60n';
const STATS_URL = 'https://stats.pixelplush.dev/v1';
const API_URL = 'https://api.pixelplush.dev/v1';

interface Account {
  username?: string;
  displayName?: string;
  profileImage?: string;
  coins?: number;
  owned?: string[];
  style?: Record<string, string>;
  styles?: Record<string, string[]>;
  error?: string;
  [key: string]: unknown;
}

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  account: Account | null;
  login: () => void;
  logout: () => void;
  refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  isLoading: true,
  isLoggedIn: false,
  token: null,
  account: null,
  login: () => {},
  logout: () => {},
  refreshAccount: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const checkAuth = useCallback(async () => {
    if (!window.ComfyTwitch) return;
    try {
      window.ComfyTwitch.SetAuthEndpoint(`${STATS_URL}/auth/code`);
      window.ComfyTwitch.SetRefreshEndpoint(`${STATS_URL}/auth/refresh`);
      const result = await window.ComfyTwitch.Check();
      if (result?.token) {
        setToken(result.token);
        try {
          const acct = await fetch(`${API_URL}/accounts`, {
            headers: { Twitch: result.token },
          }).then((r) => r.json());
          if (!acct.error) {
            setAccount(acct);
            setIsLoggedIn(true);
          }
        } catch {
          // Account fetch failed but token is valid
          setIsLoggedIn(true);
        }
      }
    } catch {
      // Not logged in
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      checkAuth();
    }
  }, [scriptLoaded, checkAuth]);

  useEffect(() => {
    if (scriptLoaded) return;
    const interval = setInterval(() => {
      if (window.ComfyTwitch) {
        setScriptLoaded(true);
        clearInterval(interval);
      }
    }, 200);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [scriptLoaded]);

  const login = useCallback(() => {
    if (!window.ComfyTwitch) {
      setTimeout(() => {
        if (window.ComfyTwitch) {
          localStorage.setItem('redirectPage', window.location.href);
          const baseUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
          window.ComfyTwitch.Login(TWITCH_CLIENT_ID, `${baseUrl}/redirect/`, [], 'code');
        }
      }, 500);
      return;
    }
    localStorage.setItem('redirectPage', window.location.href);
    const baseUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
    window.ComfyTwitch.Login(TWITCH_CLIENT_ID, `${baseUrl}/redirect/`, [], 'code');
  }, []);

  const logout = useCallback(() => {
    if (window.ComfyTwitch) {
      window.ComfyTwitch.Logout();
    }
    setIsLoggedIn(false);
    setToken(null);
    setAccount(null);
  }, []);

  const refreshAccount = useCallback(async () => {
    if (!token) return;
    try {
      const acct = await fetch(`${API_URL}/accounts`, {
        headers: { Twitch: token },
      }).then((r) => r.json());
      if (!acct.error) {
        setAccount(acct);
      }
    } catch {
      // refresh failed
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, token, account, login, logout, refreshAccount }}>
      <Script
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/comfytwitch.min.js`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />
      {children}
    </AuthContext.Provider>
  );
}
