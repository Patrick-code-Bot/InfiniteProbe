"use client";

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

  return (
    <div
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
        {onShop ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
          </div>
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
  );
}
