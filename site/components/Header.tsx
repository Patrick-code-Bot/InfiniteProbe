"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark, Wordmark } from "@/components/Logo";
import { useCart } from "@/components/cart/CartProvider";

const NAV = [
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "WHY DIFFERENT", href: "/why-different" },
  { label: "APP", href: "/app" },
  { label: "SPECS", href: "/specs" },
  { label: "SUPPORT", href: "/support" },
];

function isActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  return pathname === href;
}

export default function Header() {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const onShop = pathname === "/shop";
  const count = cart?.totalQuantity ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerBottom, setHeaderBottom] = useState(68);

  // How far the header's bottom edge sits from the top of the viewport. The
  // announcement bar scrolls away above the sticky header, so this shrinks
  // toward the bar height as the page scrolls.
  useEffect(() => {
    if (!menuOpen) return;
    const measure = () => {
      const rect = headerRef.current?.getBoundingClientRect();
      if (rect) setHeaderBottom(Math.max(0, rect.bottom));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [menuOpen]);

  // Escape to close, and lock body scroll while the panel covers the page.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div
      ref={headerRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(242,239,230,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(20,20,20,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark />
          <Wordmark />
        </Link>
        <nav className={onShop ? "nav-links-shop" : "nav-links"}>
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={isActive(pathname, item.href) ? { color: "#C9661A" } : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={onShop ? "nav-toggle-shop" : "nav-toggle"}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3.5 7h17" />
                  <path d="M3.5 12h17" />
                  <path d="M3.5 17h17" />
                </>
              )}
            </svg>
          </button>
          {onShop ? (
            <>
            <button
              onClick={openCart}
              aria-label="Open cart"
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 4px",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#141414"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              {count > 0 && (
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "#C9661A",
                    color: "#FFFFFF",
                    fontSize: 10,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={openCart}
              className="btn-ink"
              style={{
                padding: "11px 22px",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              CART
            </button>
            </>
          ) : (
            <Link href="/shop">
              <button
                className="btn-ink"
                style={{
                  padding: "11px 22px",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                SHOP NOW
              </button>
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <>
          {/* Overlay and panel both live inside the header's stacking context
              (sticky + z-index:50), so they are layered against each other, not
              against the page. */}
          <div
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: `calc(100dvh - ${headerBottom}px)`,
              zIndex: 1,
              background: "rgba(20,19,17,0.45)",
            }}
          />
          <div
            id="mobile-menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 2,
              background: "#F2EFE6",
              borderBottom: "2px solid #141414",
              boxShadow: "0 16px 40px rgba(20,19,17,0.18)",
              // The panel hangs below whatever the header's bottom edge happens
              // to be — which the announcement bar pushes down — so cap against
              // the measured offset rather than the 68px bar height alone, or
              // the last item is unreachable on short viewports.
              maxHeight: `calc(100dvh - ${headerBottom}px)`,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <nav
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                padding: "8px 24px 28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Each link closes the panel itself — it would otherwise stay
                  open over the newly navigated page. */}
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                  style={isActive(pathname, item.href) ? { color: "#C9661A" } : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setMenuOpen(false)}
                style={{ marginTop: 24 }}
              >
                <button
                  className="btn-ink"
                  style={{ width: "100%", padding: "16px 24px", fontSize: 13 }}
                >
                  SHOP NOW →
                </button>
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
