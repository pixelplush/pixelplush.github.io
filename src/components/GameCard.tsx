"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { assetPath } from "@/lib/assetPath";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    images: string[];
    href: string;
    color: "info" | "success";
    hasThemes: boolean;
  };
}

export function GameCard({ game }: GameCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (game.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % game.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [game.images.length]);

  const buttonClass = game.color === "info" ? "btn-info" : "btn-success";
  const buttonText = game.hasThemes ? "View All Themes" : "Add To Stream";

  return (
    <div className="pp-card overflow-hidden flex flex-col">
      {/* Carousel image */}
      <div className="relative aspect-video overflow-hidden bg-black/30">
        <Image
          src={assetPath(game.images[currentImage])}
          alt={game.name}
          fill
          className="object-cover"
          unoptimized
        />
        {game.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
            {game.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentImage ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-base font-semibold">{game.name}</h3>
        <p className="mb-1 text-sm text-[var(--color-pp-text)]">{game.tagline}</p>
        <p className="mb-4 flex-1 text-xs text-[var(--color-pp-text)]">
          {game.description}
        </p>
        <Link
          href={game.href}
          className={`btn ${buttonClass} w-full block text-center`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
