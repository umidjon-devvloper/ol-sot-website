import type { Metadata } from "next";
import GradesContent from "@/components/GradesContent";

export const metadata: Metadata = {
  title: "Tovar darajalari — Ol-Sot",
  description:
    "S+, S1, CPO va AS-IS gradlari — sifat darajalari, kafolat shartlari va kimga mos kelishi haqida to'liq ma'lumot.",
};

export const revalidate = 3600;

export default function GradesPage() {
  return <GradesContent />;
}
