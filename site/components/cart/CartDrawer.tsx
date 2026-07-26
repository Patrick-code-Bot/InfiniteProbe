"use client";

/* eslint-disable @next/next/no-img-element */

import { LogoMark } from "@/components/Logo";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/shopify";

export default function CartDrawer() {
  const { cart, isOpen, isBusy, configured, closeCart, setLineQuantity, removeLine } =
    useCart();

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];
  const count = cart?.totalQuantity ?? 0;

  return (
    <>
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(20,19,17,0.45)",
        }}
      />
      <div
        role="dialog"
        aria-label="Shopping cart"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          width: "min(420px,92vw)",
          background: "#F2EFE6",
          boxShadow: "-16px 0 48px rgba(20,19,17,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom: "1px solid rgba(20,20,20,0.15)",
          }}
        >
          <span className="mono" style={{ fontSize: 12, letterSpacing: "0.22em", color: "#C9661A" }}>
            YOUR CART · {count}
          </span>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="mono icon-hover"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#141414",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px" }}>
          {!configured && (
            <div
              className="mono"
              style={{
                margin: "24px 0",
                border: "1.5px dashed #C9661A",
                background: "rgba(201,102,26,0.04)",
                borderRadius: 12,
                padding: "16px 20px",
                fontSize: 10,
                letterSpacing: "0.16em",
                lineHeight: 2,
                color: "#C9661A",
              }}
            >
              [SHOPIFY NOT CONNECTED — SET STORE DOMAIN & STOREFRONT TOKEN. SEE
              LAUNCH_CHECKLIST.MD]
            </div>
          )}
          {configured && lines.length === 0 && (
            <div
              className="mono"
              style={{
                padding: "48px 0",
                textAlign: "center",
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "rgba(20,20,20,0.45)",
              }}
            >
              YOUR CART IS EMPTY
            </div>
          )}
          {lines.map((line) => (
            <div
              key={line.id}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "20px 0",
                borderBottom: "1px solid rgba(20,20,20,0.12)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: "#EAE6DA",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {line.imageUrl ? (
                  <img
                    src={line.imageUrl}
                    alt={line.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <LogoMark width={34} height={17} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "-0.01em",
                    marginBottom: 4,
                  }}
                >
                  {line.title}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: "#C9661A",
                    marginBottom: 10,
                  }}
                >
                  {formatPrice(line.price.amount, line.price.currencyCode)}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1px solid rgba(20,20,20,0.25)",
                    borderRadius: 999,
                  }}
                >
                  <button
                    onClick={() => setLineQuantity(line.id, line.quantity - 1)}
                    disabled={isBusy}
                    className="mono icon-hover"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 12px",
                      fontSize: 13,
                      color: "#141414",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="mono"
                    style={{ fontSize: 12, minWidth: 20, textAlign: "center" }}
                  >
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => setLineQuantity(line.id, line.quantity + 1)}
                    disabled={isBusy}
                    className="mono icon-hover"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 12px",
                      fontSize: 13,
                      color: "#141414",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeLine(line.id)}
                disabled={isBusy}
                aria-label="Remove"
                className="mono icon-hover"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "rgba(20,20,20,0.4)",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: "24px 28px 32px", borderTop: "1px solid rgba(20,20,20,0.15)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 20,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(20,20,20,0.6)" }}
            >
              SUBTOTAL
            </span>
            {cart && configured ? (
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {formatPrice(cart.subtotal.amount, cart.subtotal.currencyCode)}
              </span>
            ) : (
              <span
                style={{
                  border: "1.5px dashed #C9661A",
                  background: "rgba(201,102,26,0.04)",
                  borderRadius: 10,
                  padding: "4px 14px",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "rgba(20,20,20,0.35)",
                }}
              >
                [$XXX]
              </span>
            )}
          </div>
          <button
            onClick={() => {
              if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
            }}
            disabled={!cart || lines.length === 0 || isBusy}
            className="btn-ink"
            style={{
              width: "100%",
              padding: "17px 24px",
              fontSize: 14,
              opacity: !cart || lines.length === 0 ? 0.5 : 1,
            }}
          >
            CHECKOUT
          </button>
          <div
            className="mono"
            style={{
              textAlign: "center",
              marginTop: 14,
              fontSize: 10,
              letterSpacing: "0.16em",
              color: "rgba(20,20,20,0.5)",
            }}
          >
            SECURE CHECKOUT BY SHOPIFY
          </div>
        </div>
      </div>
    </>
  );
}
