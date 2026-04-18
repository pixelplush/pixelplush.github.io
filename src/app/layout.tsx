import type { Metadata } from "next";
import { Fredoka, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Analytics } from "@/components/Analytics";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/i18n";
import { SiteNotices } from "@/components/SiteNotices";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
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
  alternates: {
    canonical: "/",
  },
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
      <head>
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","wdlmotp71n");`}
        </Script>
      </head>
      <body className={`${fredoka.variable} ${ibm.variable} font-sans antialiased text-[var(--color-pp-text)] bg-[var(--color-pp-bg)] min-h-screen`}>
        <AuthProvider>
          <I18nProvider>
          <Analytics />
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-1 bg-[var(--color-pp-bg)] relative">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <SiteNotices />
                <main className="flex-1 p-6">{children}</main>
              </div>
            </div>
            <Footer />
          </div>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

