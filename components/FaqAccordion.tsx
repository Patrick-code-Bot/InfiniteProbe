"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Support-page FAQ accordion. Answers are still drafts — they render inside
 * the dashed-orange "confirm before publish" treatment until finalized.
 */
export default function FaqAccordion({
  items,
  defaultOpen = 0,
}: {
  items: FaqItem[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((f, i) => (
        <div
          key={f.q}
          style={{
            background: "#FBF9F3",
            borderRadius: 16,
            boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="row-hover"
            aria-expanded={open === i}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              textAlign: "left",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", flex: 1, lineHeight: 1.4 }}>
              {f.q}
            </span>
            <span className="mono" style={{ fontSize: 16, color: "#C9661A" }}>
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: "0 28px 26px" }}>
              <div
                style={{
                  border: "1.5px dashed #C9661A",
                  background: "rgba(201,102,26,0.04)",
                  borderRadius: 12,
                  padding: "18px 22px",
                }}
              >
                <div
                  className="mono"
                  style={{ fontSize: 10, letterSpacing: "0.18em", color: "#C9661A", marginBottom: 10 }}
                >
                  DRAFT ANSWER — CONFIRM BEFORE PUBLISH
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(20,20,20,0.55)" }}>{f.a}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
