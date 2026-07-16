import { ImageResponse } from "next/og";

export const alt = "InfiniteProbe — Infinite Power for Perfect Meat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PATH_LEFT =
  "M120,60 C100,24 58,14 34,29 C10,44 10,76 34,91 C58,106 100,96 120,60 C104,88 64,96 42,83 C24,72 24,48 42,37 C64,24 104,32 120,60 Z";
const PATH_RIGHT =
  "M120,60 C140,24 182,14 206,29 C230,44 230,76 206,91 C182,106 140,96 120,60 C136,88 176,96 198,83 C216,72 216,48 198,37 C176,24 136,32 120,60 Z";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#161513",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <svg width="300" height="150" viewBox="0 0 240 120">
          <path d={PATH_LEFT} fill="#F2EFE6" />
          <path d={PATH_RIGHT} fill="#F2EFE6" />
          <circle cx="120" cy="60" r="6" fill="#C9661A" />
        </svg>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, letterSpacing: "0.14em" }}>
          <span style={{ color: "#C9661A" }}>INFINITE</span>
          <span style={{ color: "#F2EFE6" }}>PROBE</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.32em",
            color: "rgba(242,239,230,0.6)",
          }}
        >
          INFINITE POWER · PERFECT MEAT
        </div>
      </div>
    ),
    { ...size }
  );
}
