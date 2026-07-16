import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { SITE_URL, SITE_NAME, TAGLINE } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — The Self-Powered Wireless Meat Thermometer`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "InfiniteProbe converts cooking heat into electricity — powering real-time wireless monitoring of your meat's internal temperature. No batteries. No charging. No guessing.",
  keywords: [
    "wireless meat thermometer",
    "self-powered thermometer",
    "battery-free meat probe",
    "thermoelectric",
    "BBQ thermometer",
    "smart cooking",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Self-Powered Wireless Meat Thermometer`,
    description:
      "Infinite Power for Perfect Meat. Heat-powered, truly wireless, precision from the core.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description:
      "The self-powered wireless meat thermometer. No batteries. No charging. No guessing.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
