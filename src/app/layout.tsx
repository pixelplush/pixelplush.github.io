import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PixelPlush - Twitch Stream Overlay Games",
    template: "%s | PixelPlush",
  },
  description:
    "Free interactive Twitch stream overlay games. Viewers play by typing in chat. Parachute, Plinko, Maze, Giveaway Tool, and more!",
  keywords: [
    "pixelplush",
    "twitch",
    "stream overlay",
    "browser source",
    "obs games",
    "twitch chat games",
    "instafluff",
    "maaya",
  ],
  metadataBase: new URL("https://www.pixelplush.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pixelplush.dev",
    siteName: "PixelPlush",
    title: "PixelPlush - Twitch Stream Overlay Games",
    description:
      "Free interactive Twitch stream overlay games by Maaya and Instafluff.",
    images: [
      {
        url: "/app-assets/images/logo/silhouette.png",
        width: 512,
        height: 512,
        alt: "PixelPlush Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    creator: "@PixelPlushGames",
    title: "PixelPlush - Twitch Stream Overlay Games",
    description:
      "Free interactive Twitch stream overlay games by Maaya and Instafluff.",
    images: ["/app-assets/images/logo/silhouette.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Analytics />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
