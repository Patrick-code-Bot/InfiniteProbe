"use client";

import { useState } from "react";
import specs from "@/data/specs.json";

/**
 * Collapsible spec tables. All values come from data/specs.json — rows with
 * tbc:true render in the dashed-orange "awaiting engineering" treatment.
 */
export default function SpecTables() {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(specs.tables.map((t) => [t.key, t.defaultOpen]))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {specs.tables.map((t) => (
        <div
          key={t.key}
          style={{
            background: "#FBF9F3",
            borderRadius: 20,
            boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setOpen((s) => ({ ...s, [t.key]: !s[t.key] }))}
            className="row-hover"
            aria-expanded={open[t.key]}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "26px 32px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left",
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 12, letterSpacing: "0.2em", color: "#C9661A", whiteSpace: "nowrap" }}
            >
              {t.section}
            </span>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "0.06em", flex: 1 }}>
              {t.title}
            </span>
            <span className="mono" style={{ fontSize: 16, color: "rgba(20,20,20,0.5)" }}>
              {open[t.key] ? "−" : "+"}
            </span>
          </button>
          {open[t.key] && (
            <div style={{ padding: "0 32px 12px" }}>
              {t.rows.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "16px 0",
                    borderTop: "1px solid rgba(20,20,20,0.08)",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15, flex: "0 1 auto" }}>{row.label}</span>
                  <span
                    className="mono"
                    style={{
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      textAlign: "right",
                      flex: "1 1 auto",
                      maxWidth: "100%",
                      color: row.tbc ? "#C9661A" : "rgba(20,20,20,0.8)",
                      background: row.tbc ? "rgba(201,102,26,0.06)" : "transparent",
                      borderRadius: 8,
                      padding: row.tbc ? "6px 12px" : 0,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
