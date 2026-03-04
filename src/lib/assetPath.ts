/**
 * Prepend the Next.js basePath to a static asset URL.
 *
 * Next.js automatically handles basePath for <Link> and the image
 * optimisation loader, but with `unoptimized: true` (used in static
 * exports) the <Image> component renders a plain <img> whose `src`
 * is NOT prefixed.  This helper fills that gap.
 *
 * Usage:
 *   <Image src={assetPath("/app-assets/images/logo/logo.png")} … />
 *   <img  src={assetPath("/images/banner.png")} … />
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  // Don't touch absolute URLs or data: URIs
  if (!path || path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  // Already prefixed — return as-is
  if (path.startsWith(BASE_PATH + "/")) {
    return path;
  }
  // Normalise: ensure leading slash
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
