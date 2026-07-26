/**
 * The eyebrow + hairline + meta row used at the top of every section.
 * `dark` switches the hairline/meta colors for charcoal bands.
 */
export default function SectionRule({
  eyebrow,
  meta,
  metaColor,
  dark = false,
  marginBottom = 20,
}: {
  eyebrow: string;
  meta?: string;
  metaColor?: string;
  dark?: boolean;
  marginBottom?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom }}>
      <span
        className="mono"
        style={{
          fontSize: 12,
          letterSpacing: "0.22em",
          color: "#C9661A",
          whiteSpace: "nowrap",
        }}
      >
        {eyebrow}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: dark ? "rgba(242,239,230,0.18)" : "rgba(20,20,20,0.15)",
        }}
      />
      {meta && (
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            color:
              metaColor ?? (dark ? "rgba(242,239,230,0.4)" : "rgba(20,20,20,0.4)"),
          }}
        >
          {meta}
        </span>
      )}
    </div>
  );
}
