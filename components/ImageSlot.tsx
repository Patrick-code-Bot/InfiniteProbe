import Image from "next/image";

/**
 * Renders an image if `src` is provided, or the design system's dashed-orange
 * "awaiting asset" placeholder if not. Drop the real file into /public/images
 * and pass its path — <Image> handles optimization and responsive sizing.
 */
export default function ImageSlot({
  src,
  alt,
  label,
  radius = 20,
  fit = "cover",
  background,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  style,
}: {
  src?: string | null;
  alt: string;
  /** Placeholder caption shown while the asset is missing. */
  label: string;
  radius?: number;
  fit?: "cover" | "contain";
  background?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  if (src) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius,
          overflow: "hidden",
          background,
          ...style,
        }}
      >
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            style={{ width: "100%", height: "100%", objectFit: fit }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectFit: fit }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} (image pending)`}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: radius,
        border: "1.5px dashed #C9661A",
        background: "rgba(201,102,26,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        ...style,
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "#C9661A",
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        {label}
      </span>
    </div>
  );
}
