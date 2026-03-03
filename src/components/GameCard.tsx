"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    images: string[];
    href: string;
    color: "blue" | "green";
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

  const buttonColor =
    game.color === "blue"
      ? "bg-blue-600 hover:bg-blue-500"
      : "bg-emerald-600 hover:bg-emerald-500";

  const buttonText = game.hasThemes ? "View All Themes" : "Add To Stream";

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[var(--color-pp-card)] transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Carousel image */}
      <div className="relative aspect-square overflow-hidden bg-black/20">
        <Image
          src={game.images[currentImage]}
          alt={game.name}
          fill
          className="object-cover transition-opacity duration-500"
          unoptimized
        />
        {game.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
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
        <h3 className="mb-1 text-lg font-bold text-white">{game.name}</h3>
        <p className="mb-1 text-sm text-slate-400">{game.tagline}</p>
        <p className="mb-4 flex-1 text-xs text-slate-500">
          {game.description}
        </p>
        <Link
          href={game.href}
          className={`block rounded-lg ${buttonColor} px-4 py-2 text-center text-sm font-semibold text-white transition-colors`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
