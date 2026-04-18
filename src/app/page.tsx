"use client";

import Image from "next/image";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { useTranslation } from "@/i18n";

const games = [
  {
    id: "giveaway",
    name: "Giveaway Tool",
    tagline: "Fun way to do giveaways on Twitch",
    description: "Run giveaways in an easy and fun way for your viewers!",
    images: [
      "/app-assets/images/games/giveaway_basic.gif",
      "/app-assets/images/games/giveaway_blossoms.gif",
      "/app-assets/images/games/giveaway_autumn.gif",
    ],
    href: "/games?type=giveaway",
    color: "info" as const,
    hasThemes: true,
  },
  {
    id: "weather",
    name: "Stream Weather",
    tagline: "Stream Weather Overlay Using Channel Points for Twitch",
    description:
      "Weather changing stream overlay to add more fun for your viewers!",
    images: ["/app-assets/images/games/streamweather_square.gif"],
    href: "/games?type=weather",
    color: "success" as const,
    hasThemes: false,
  },
  {
    id: "confetti",
    name: "Pixel Confetti",
    tagline: "Stream Confetti Overlay Using Channel Points for Twitch",
    description: "Confetti sent into your stream by your viewers!",
    images: ["/app-assets/images/games/pixelconfetti_square.gif"],
    href: "/games?type=confetti",
    color: "success" as const,
    hasThemes: false,
  },
  {
    id: "plinko",
    name: "Plinko Bounce",
    tagline: "Plinko Stream Overlay Game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: [
      "/app-assets/images/games/plinko_christmas_website.gif",
      "/app-assets/images/games/pixelplinkohalloween.gif",
      "/app-assets/images/games/plinko_day_website.gif",
    ],
    href: "/games?type=plinko&game=pixelplinko",
    color: "info" as const,
    hasThemes: true,
  },
  {
    id: "parachute",
    name: "Parachute Drop",
    tagline: "Parachute Stream Overlay Game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: [
      "/app-assets/images/games/drop_cauldron_rainbow_website.gif",
      "/app-assets/images/games/drop_christmas.gif",
      "/app-assets/images/games/drop_cake_rainbow_website.gif",
    ],
    href: "/games?type=parachute",
    color: "info" as const,
    hasThemes: true,
  },
  {
    id: "chatflakes",
    name: "Chat Flakes",
    tagline: "Chat Messages turned into Stream Particles for Twitch",
    description:
      "Let your viewers add subtle particle effects across your screen by typing in chat!",
    images: ["/app-assets/images/games/chatflakes.gif"],
    href: "/games?type=chatflakes",
    color: "success" as const,
    hasThemes: false,
  },
  {
    id: "hillroll",
    name: "Hill Rolling Race",
    tagline: "Racing Stream Overlay Game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: ["/app-assets/images/games/hill_christmas_gif.gif"],
    href: "/games?type=hillroll",
    color: "info" as const,
    hasThemes: true,
  },
  {
    id: "maze",
    name: "Pixel Maze",
    tagline: "Stream Maze Game for Twitch",
    description:
      "Free stream game to keep your viewers entertained during your breaks!",
    images: [
      "/app-assets/images/games/maze_christmas_gif.gif",
      "/app-assets/images/games/maze_winter_gif.gif",
      "/app-assets/images/games/wanderingwizards.gif",
    ],
    href: "/games?type=maze",
    color: "info" as const,
    hasThemes: true,
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Welcome card */}
      <div className="pp-card p-5 mb-6">
        <h4 className="text-lg font-semibold mb-2">{t('home.hello')}</h4>
        <p className="text-[var(--color-pp-text)]">
          {t('home.welcomeText')}{" "}
          <a
            href="https://twitch.tv/maaya"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
          >
            Maaya
          </a>{" "}
          (Art) and{" "}
          <a
            href="https://twitch.tv/instafluff"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
          >
            Instafluff
          </a>{" "}
          (Code)
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {games.map((game) => (
          <GameCard key={game.id} game={{
            ...game,
            name: t(`gameData.${game.id}.name`),
            tagline: t(`gameData.${game.id}.tagline`),
            description: t(`gameData.${game.id}.description`),
          }} />
        ))}

        {/* Market Promo Card */}
        <div className="pp-card overflow-hidden" style={{ backgroundColor: "var(--color-pp-warning)" }}>
          <div className="p-5 text-center text-white">
            <h3 className="text-xl font-bold mb-3 !text-white">{t('home.getCharacters')}</h3>
            <div className="flex justify-center gap-3 py-3 mb-3">
              {[
                { src: "https://www.pixelplush.dev/assets/characters/yeti_blue/yeti_blue_front/yeti_blue_front1.png", alt: "Yeti Blue" },
                { src: "https://www.pixelplush.dev/assets/characters/snowman/snowman_front/snowman_front1.png", alt: "Snowman" },
                { src: "https://www.pixelplush.dev/assets/characters/santa/santa_front/santa_front1.png", alt: "Santa" },
                { src: "https://www.pixelplush.dev/assets/pets/yetchi_pink/yetchi_pink_front/yetchi_pink_front1.png", alt: "Yetchi Pink" },
                { src: "https://www.pixelplush.dev/assets/pets/snowball/snowball_front/snowball_front1.png", alt: "Snowball" },
              ].map((char) => (
                <Image
                  key={char.alt}
                  src={char.src}
                  alt={char.alt}
                  width={40}
                  height={40}
                  className="pixelated"
                  unoptimized
                />
              ))}
            </div>
            <p className="text-sm mb-4 text-white/90">
              {t('home.getCharactersDesc')}
            </p>
            <Link href="/market" className="btn btn-primary w-full block">
              {t('home.visitMarket')}
            </Link>
          </div>
        </div>
      </div>

      {/* What's New */}
      <div className="pp-card p-5">
        <h3 className="text-lg font-semibold mb-4">{t('home.whatsNew')}</h3>
        <div className="flex flex-col gap-4">
          {[
            {
              date: '2026-03-29',
              title: 'New Website Design',
              body: "We've launched a brand new website! Browse games, customize your character, and shop goodies all in one place.",
              badge: 'Update',
              badgeColor: 'bg-[var(--color-pp-accent)] text-white',
            },
            {
              date: '2026-03-15',
              title: 'Easter Event Coming Soon',
              body: 'Get ready for our Easter event with special themed games and new items!',
              badge: 'Event',
              badgeColor: 'bg-[var(--color-pp-warning)] text-white',
            },
            {
              date: '2026-02-01',
              title: 'New Parachute Themes',
              body: 'Check out the new Valentines and Pool Party themes for Parachute Drop!',
              badge: 'New Content',
              badgeColor: 'bg-[var(--color-pp-success)] text-white',
            },
          ].map((item) => (
            <div
              key={item.date + item.title}
              className="flex gap-4 items-start border-l-3 border-[var(--color-pp-warning)] pl-4 py-1"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs text-[var(--color-pp-text-muted)]">{item.date}</span>
                </div>
                <h4 className="text-sm font-semibold mb-0.5">{item.title}</h4>
                <p className="text-sm text-[var(--color-pp-text-muted)] leading-snug">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
