'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // ComfyTwitch.Check() in AuthProvider handles the token exchange.
    // We just need to redirect after a short delay to let auth complete.
    const timer = setTimeout(() => {
      const redirect = localStorage.getItem('redirectPage');
      if (redirect) {
        localStorage.removeItem('redirectPage');
        // Convert absolute URL to relative path for Next.js router
        try {
          const url = new URL(redirect);
          router.push(url.pathname);
        } catch {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        <h1 className="text-xl font-bold text-white">Logging you in...</h1>
        <p className="mt-2 text-sm text-slate-400">Please wait while we verify your Twitch account.</p>
      </div>
    </div>
  );
}
