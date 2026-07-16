import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Choose your InfiniteProbe setup — one probe or the whole table, every setup is self-powered, forever. Free shipping on all orders.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop InfiniteProbe — Choose Your Setup",
    description: "One probe or the whole table — every setup is self-powered, forever.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
