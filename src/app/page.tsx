import Image from "next/image";
import Link from "next/link";
import { FeaturedStream } from "@/components/FeaturedStream";
import { GameCard } from "@/components/GameCard";

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
    color: "blue" as const,
    hasThemes: true,
  },
  {
    id: "weather",
    name: "Stream Weather",
    tagline: "Weather overlay using Channel Points",
    description:
      "Weather changing stream overlay to add more fun for your viewers!",
    images: ["/app-assets/images/games/streamweather_square.gif"],
    href: "/games?type=weather",
    color: "green" as const,
    hasThemes: false,
  },
  {
    id: "confetti",
    name: "Pixel Confetti",
    tagline: "Stream confetti overlay using Channel Points",
    description: "Confetti sent into your stream by your viewers!",
    images: ["/app-assets/images/games/pixelconfetti_square.gif"],
    href: "/games?type=confetti",
    color: "green" as const,
    hasThemes: false,
  },
  {
    id: "plinko",
    name: "Plinko Bounce",
    tagline: "Plinko stream overlay game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: [
      "/app-assets/images/games/plinko_christmas_website.gif",
      "/app-assets/images/games/pixelplinkohalloween.gif",
      "/app-assets/images/games/plinko_day_website.gif",
    ],
    href: "/games?type=plinko&game=pixelplinko",
    color: "blue" as const,
    hasThemes: true,
  },
  {
    id: "parachute",
    name: "Parachute Drop",
    tagline: "Parachute stream overlay game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: [
      "/app-assets/images/games/drop_cauldron_rainbow_website.gif",
      "/app-assets/images/games/drop_christmas.gif",
      "/app-assets/images/games/drop_cake_rainbow_website.gif",
    ],
    href: "/games?type=parachute",
    color: "blue" as const,
    hasThemes: true,
  },
  {
    id: "chatflakes",
    name: "Chat Flakes",
    tagline: "Chat messages turned into stream particles",
    description:
      "Let your viewers add subtle particle effects across your screen by typing in chat!",
    images: ["/app-assets/images/games/chatflakes.gif"],
    href: "/games?type=chatflakes",
    color: "green" as const,
    hasThemes: false,
  },
  {
    id: "hillroll",
    name: "Hill Rolling Race",
    tagline: "Racing stream overlay game for Twitch",
    description: "Free stream game to add more fun for your viewers!",
    images: ["/app-assets/images/games/hill_christmas_gif.gif"],
    href: "/games?type=hillroll",
    color: "blue" as const,
    hasThemes: true,
  },
  {
    id: "maze",
    name: "Pixel Maze",
    tagline: "Stream maze game for Twitch",
    description:
      "Free stream game to keep your viewers entertained during your breaks!",
    images: [
      "/app-assets/images/games/maze_christmas_gif.gif",
      "/app-assets/images/games/maze_winter_gif.gif",
      "/app-assets/images/games/wanderingwizards.gif",
    ],
    href: "/games?type=maze",
    color: "blue" as const,
    hasThemes: true,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <div className="mb-6">
          <Image
            src="/app-assets/images/logo/logo.png"
            alt="PixelPlush"
            width={120}
            height={120}
            className="pixelated mx-auto mb-4"
          />
          <h1 className="mb-3 text-4xl font-bold text-white sm:text-5xl">
            Stream Overlay Games for{" "}
            <span className="text-purple-400">Twitch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Free interactive games your viewers can play by typing in chat.
            Built with love by{" "}
            <a
              href="https://twitch.tv/maaya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              Maaya
            </a>{" "}
            &amp;{" "}
            <a
              href="https://twitch.tv/instafluff"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              Instafluff
            </a>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/games"
            className="rounded-xl bg-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-500 transition-all hover:shadow-purple-500/30"
          >
            Browse Games
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-lg font-semibold text-white hover:bg-white/10 transition-all"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Featured Stream */}
      <FeaturedStream />

      {/* Games Grid */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-white">Our Games</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Market Promo */}
      <section className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 p-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          Get Characters &amp; Pets!
        </h2>
        <div className="mb-4 flex justify-center gap-4">
          {[
            {
              src: "https://www.pixelplush.dev/assets/characters/yeti_blue/yeti_blue_front/yeti_blue_front1.png",
              alt: "Yeti Blue",
            },
            {
              src: "https://www.pixelplush.dev/assets/characters/snowman/snowman_front/snowman_front1.png",
              alt: "Snowman",
            },
            {
              src: "https://www.pixelplush.dev/assets/characters/santa/santa_front/santa_front1.png",
              alt: "Santa",
            },
            {
              src: "https://www.pixelplush.dev/assets/pets/yetchi_pink/yetchi_pink_front/yetchi_pink_front1.png",
              alt: "Yetchi Pink",
            },
            {
              src: "https://www.pixelplush.dev/assets/pets/snowball/snowball_front/snowball_front1.png",
              alt: "Snowball",
            },
          ].map((char) => (
            <Image
              key={char.alt}
              src={char.src}
              alt={char.alt}
              width={48}
              height={48}
              className="pixelated"
              unoptimized
            />
          ))}
        </div>
        <p className="mb-4 text-slate-300">
          Get special characters and pets to use in PixelPlush games!
        </p>
        <Link
          href="/market"
          className="inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400 transition-colors"
        >
          Visit the Goodies Market
        </Link>
      </section>
    </div>
  );
}
