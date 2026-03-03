import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--color-pp-darker)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} PixelPlush by{" "}
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
          <nav className="flex items-center gap-4 text-sm text-slate-400">
            <a
              href="https://discord.gg/pixelplush"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Discord
            </a>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/credits"
              className="hover:text-white transition-colors"
            >
              Credits
            </Link>
            <Link
              href="/troubleshoot"
              className="hover:text-white transition-colors"
            >
              Help
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
