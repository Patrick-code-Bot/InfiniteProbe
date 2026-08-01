/**
 * REFERENCE — target: site/components/VideoPlayer.tsx
 *
 * HD video from Shopify CDN file URLs.
 *
 * Deliberately a Server Component: a plain <video> element needs no JS for
 * playback, and native controls handle fullscreen, scrubbing, PiP and captions
 * better than any custom UI. Only add 'use client' if you need play-state in
 * React (analytics, custom overlay, autoplay-on-scroll).
 *
 * Upload flow: Shopify admin → Content → Files → upload → copy the CDN URL.
 * Shopify serves these with range requests and correct caching headers, which
 * is what makes seeking work.
 */

interface VideoPlayerProps {
  /** Full https://cdn.shopify.com/... URL. */
  src: string;
  /** Poster frame. Strongly recommended — without one the player is blank until buffered. */
  poster?: string;
  /** Accessible label, used as aria-label. */
  label?: string;
  /**
   * Muted looping background video. Sets autoPlay+muted+loop+playsInline and
   * hides controls. iOS Safari only honours autoplay when muted AND playsInline.
   */
  ambient?: boolean;
  /** Poster loads eagerly for above-the-fold video; lazy otherwise. */
  priority?: boolean;
  className?: string;
}

const SHOPIFY_CDN_HOST = "cdn.shopify.com";

export function VideoPlayer({
  src,
  poster,
  label,
  ambient = false,
  priority = false,
  className,
}: VideoPlayerProps) {
  // Fail loudly in dev, silently in prod — a broken video should not 500 a page.
  if (!isValidVideoSrc(src)) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `VideoPlayer: expected an https ${SHOPIFY_CDN_HOST} URL, received "${src}".`
      );
    }
    return null;
  }

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      aria-label={label}
      controls={!ambient}
      autoPlay={ambient}
      muted={ambient}
      loop={ambient}
      playsInline
      // Ambient video is decorative: keep it out of the a11y tree.
      aria-hidden={ambient || undefined}
      tabIndex={ambient ? -1 : undefined}
      // "metadata" fetches dimensions/duration without pulling the whole file.
      preload={priority ? "auto" : "metadata"}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* Fallback for browsers that cannot play the source at all. */}
      <a href={src}>Download video</a>
    </video>
  );
}

function isValidVideoSrc(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(SHOPIFY_CDN_HOST);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */

/**
 * Notes for implementation:
 *
 * 1. `next/image` does not handle video. The `poster` attribute takes a raw
 *    URL, so add `cdn.shopify.com` to `next.config.mjs` remotePatterns only for
 *    the *image* usages elsewhere — the poster here bypasses the image
 *    optimizer entirely.
 *
 * 2. Shopify CDN serves a single MP4 per file — there is no adaptive bitrate.
 *    For genuinely large HD hero videos, either keep them short (<10s, ambient)
 *    or use a streaming host. "HD video direct from CDN" means every visitor
 *    downloads the full-resolution file regardless of connection.
 *
 * 3. `prefers-reduced-motion` should suppress ambient autoplay. That needs a
 *    client component or a CSS-only approach; the media query cannot be read
 *    on the server. Recommended CSS in globals.css:
 *
 *      @media (prefers-reduced-motion: reduce) {
 *        video[aria-hidden="true"] { display: none; }
 *      }
 *
 *    — paired with a visible poster image fallback.
 */
