import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-pp-border)] bg-[var(--color-pp-footer)] px-4 py-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--color-pp-text)]">
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/pixelplush"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-pp-accent)] transition-colors"
          >
            PixelPlush Discord
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-[var(--color-pp-accent)] transition-colors">
            Terms of Service
          </Link>
          <span className="text-[var(--color-pp-border)]">|</span>
          <Link href="/privacy" className="hover:text-[var(--color-pp-accent)] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-[var(--color-pp-border)]">|</span>
          <span>
            &copy; {new Date().getFullYear()} PIXELPLUSH&trade;
          </span>
        </div>
      </div>
    </footer>
  );
}
