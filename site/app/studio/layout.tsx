/**
 * Root layout for the Studio route.
 *
 * Needed because the site's root layout moved under app/[lang]/ (see
 * docs/refactor/README.md phase 1) — /studio sits outside that segment, so it
 * has no <html>/<body> otherwise.
 *
 * Deliberately bare: no fonts, no globals.css, no CartProvider. The Studio
 * ships its own styling, and the site's design system would fight it.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
