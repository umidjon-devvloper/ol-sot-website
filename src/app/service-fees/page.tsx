import type { Metadata } from "next";
import ServiceFeesContent from "@/components/ServiceFeesContent";

export const metadata: Metadata = {
  title: "Xizmat haqi — Ol-Sot",
  description:
    "Ol-Sot xizmat haqi, yetkazib berish narxlari, kafolat shartlari va to'lov usullari haqida to'liq ma'lumot.",
};

export const revalidate = 3600;

export default function ServiceFeesPage() {
  return <ServiceFeesContent />;
}
