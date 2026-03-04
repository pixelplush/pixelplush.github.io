import type { Metadata } from "next";
import { Rubik, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/lib/auth";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const ibm = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
});

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
    description: "Free interactive Twitch stream overlay games by Maaya and Instafluff.",
    images: [{ url: "/app-assets/images/logo/silhouette.png", width: 512, height: 512, alt: "PixelPlush Logo" }],
  },
  twitter: {
    card: "summary",
    creator: "@PixelPlushGames",
    title: "PixelPlush - Twitch Stream Overlay Games",
    description: "Free interactive Twitch stream overlay games by Maaya and Instafluff.",
    images: ["/app-assets/images/logo/silhouette.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${ibm.variable} font-sans antialiased text-[var(--color-pp-text)] bg-[var(--color-pp-bg)] min-h-screen`}>
        <AuthProvider>
          <Analytics />
          <div className="flex bg-[var(--color-pp-bg)] min-h-screen relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6">{children}</main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

