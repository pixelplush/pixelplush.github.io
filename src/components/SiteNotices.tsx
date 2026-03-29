'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NoticeLink {
  text: string;
  url: string;
}

interface Notice {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  link?: NoticeLink;
  dismissible: boolean;
  pages: string[];
}

const DISMISS_KEY = 'pp-dismissed-notices';

const typeStyles: Record<Notice['type'], { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-amber-50',
    border: 'border-l-4 border-amber-400',
    text: 'text-amber-900',
    icon: 'ℹ️',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-l-4 border-yellow-500',
    text: 'text-yellow-900',
    icon: '⚠️',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-red-500',
    text: 'text-red-900',
    icon: '🚨',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-l-4 border-green-500',
    text: 'text-green-900',
    icon: '✅',
  },
};

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || '[]');
  } catch {
    return [];
  }
}

function setDismissed(ids: string[]) {
  localStorage.setItem(DISMISS_KEY, JSON.stringify(ids));
}

export function SiteNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissedState] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setDismissedState(getDismissed());

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    fetch(`${basePath}/notices.json`)
      .then((r) => (r.ok ? r.json() : { notices: [] }))
      .then((data) => setNotices(data.notices ?? []))
      .catch(() => {});
  }, []);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissedState(next);
    setDismissed(next);
  };

  // Strip basePath from pathname for matching
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const pagePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname;

  const visible = notices.filter((n) => {
    if (dismissed.includes(n.id)) return false;
    if (n.pages.length > 0 && !n.pages.includes(pagePath)) return false;
    return true;
  });

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-0">
      {visible.map((notice) => {
        const s = typeStyles[notice.type];
        return (
          <div
            key={notice.id}
            className={`${s.bg} ${s.border} ${s.text} px-4 py-2.5 flex items-center gap-3 text-sm`}
          >
            <span className="flex-shrink-0">{s.icon}</span>
            <span className="flex-1">
              {notice.message}
              {notice.link && (
                <a
                  href={notice.link.url}
                  className={`${s.text} font-semibold underline ml-2`}
                >
                  {notice.link.text}
                </a>
              )}
            </span>
            {notice.dismissible && (
              <button
                onClick={() => dismiss(notice.id)}
                className={`${s.text} opacity-60 hover:opacity-100 flex-shrink-0 text-lg leading-none cursor-pointer`}
                aria-label="Dismiss notice"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
