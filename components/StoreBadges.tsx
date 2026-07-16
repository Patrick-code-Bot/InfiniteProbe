import { LINKS, hrefOrHash } from "@/lib/site";

/**
 * App Store / Google Play badges. Links resolve to "#" until the store URLs
 * are set in lib/site.ts (see LAUNCH_CHECKLIST.md).
 */
export default function StoreBadges({
  variant = "dark",
  padding = "12px 20px",
  fontSize = 11,
}: {
  variant?: "dark" | "light";
  padding?: string;
  fontSize?: number;
}) {
  const className = variant === "dark" ? "badge-dark" : "badge-light";
  return (
    <>
      <a
        href={hrefOrHash(LINKS.appStore)}
        className={className}
        style={{ padding, fontSize }}
      >
         APP STORE
      </a>
      <a
        href={hrefOrHash(LINKS.googlePlay)}
        className={className}
        style={{ padding, fontSize }}
      >
        ▷ GOOGLE PLAY
      </a>
    </>
  );
}
