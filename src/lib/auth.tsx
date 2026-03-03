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
}

const AuthContext = createContext<AuthState>({
  isLoading: true,
  isLoggedIn: false,
  token: null,
  account: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
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

  const login = useCallback(() => {
    if (!window.ComfyTwitch) return;
    localStorage.setItem('redirectPage', window.location.href);
    const baseUrl = window.location.origin;
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

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, token, account, login, logout }}>
      <Script
        src="/comfytwitch.min.js"
        strategy="beforeInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />
      {children}
    </AuthContext.Provider>
  );
}
