"use client";

import { useState, useEffect } from "react";

export function FeaturedStream() {
  const [channel, setChannel] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveStreams() {
      try {
        const res = await fetch(
          "https://api.pixelplush.dev/v1/analytics/sessions/live/short"
        );
        const livestreams: string[] = await res.json();

        if (livestreams.length > 0) {
          if (
            livestreams.includes("maaya") &&
            livestreams.includes("instafluff")
          ) {
            setChannel(Math.random() < 0.5 ? "maaya" : "instafluff");
          } else if (livestreams.includes("maaya")) {
            setChannel("maaya");
          } else if (livestreams.includes("instafluff")) {
            setChannel("instafluff");
          } else {
            setChannel(
              livestreams[Math.floor(Math.random() * livestreams.length)]
            );
          }
        } else {
          setChannel("pixelplushgames");
        }
      } catch {
        setChannel("pixelplushgames");
      }
    }

    fetchLiveStreams();
    const interval = setInterval(fetchLiveStreams, 60000 * 3);
    return () => clearInterval(interval);
  }, []);

  if (!channel) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-pp-headings)] flex items-center gap-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        Live Stream
      </h3>
      <div className="overflow-hidden rounded border border-[var(--color-pp-border)]">
        <div className="aspect-video">
          <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=www.pixelplush.dev&parent=localhost`}
            className="h-full w-full"
            allowFullScreen
            title={`${channel} - Twitch Stream`}
          />
        </div>
      </div>
    </div>
  );
}
