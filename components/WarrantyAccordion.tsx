"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export interface WarrantySection {
  id: string;
  title: string;
  body: ReactNode;
}

export default function WarrantyAccordion({
  sections,
  defaultOpen = 0,
}: {
  sections: WarrantySection[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sections.map((s, i) => (
        <div
          key={s.id}
          id={s.id}
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
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.16em", color: "#C9661A" }}>
              § {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", flex: 1, lineHeight: 1.3 }}>
              {s.title}
            </span>
            <span className="mono" style={{ fontSize: 18, color: "#C9661A" }}>
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: "0 28px 28px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(20,20,20,0.75)",
                }}
              >
                {s.body}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
