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
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-bold text-white">
        <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-red-500" />
        Live Now
      </h2>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="aspect-video">
          <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=www.pixelplush.dev`}
            className="h-full w-full"
            allowFullScreen
            title={`${channel} - Twitch Stream`}
          />
        </div>
      </div>
    </section>
  );
}
