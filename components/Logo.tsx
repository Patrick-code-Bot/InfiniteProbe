const PATH_LEFT =
  "M120,60 C100,24 58,14 34,29 C10,44 10,76 34,91 C58,106 100,96 120,60 C104,88 64,96 42,83 C24,72 24,48 42,37 C64,24 104,32 120,60 Z";
const PATH_RIGHT =
  "M120,60 C140,24 182,14 206,29 C230,44 230,76 206,91 C182,106 140,96 120,60 C136,88 176,96 198,83 C216,72 216,48 198,37 C176,24 136,32 120,60 Z";

export function LogoMark({
  width = 48,
  height = 24,
  fill = "#141414",
  style,
}: {
  width?: number;
  height?: number;
  fill?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 120"
      style={style}
      aria-label="InfiniteProbe mark"
    >
      <path d={PATH_LEFT} fill={fill} />
      <path d={PATH_RIGHT} fill={fill} />
      <circle cx="120" cy="60" r="6" fill="#C9661A" />
    </svg>
  );
}

export function Wordmark({
  fontSize = 15,
  color = "#141414",
}: {
  fontSize?: number;
  color?: string;
}) {
  return (
    <span style={{ fontWeight: 800, fontSize, letterSpacing: "0.12em", color }}>
      <span style={{ color: "#C9661A" }}>INFINITE</span>PROBE
    </span>
  );
}
