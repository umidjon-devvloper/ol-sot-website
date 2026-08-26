import type { Metadata } from "next";
import CustomsCalculatorContent from "@/components/CustomsCalculatorContent";

export const metadata: Metadata = {
  title: "Rastamojka kalkulyatori — Ol-Sot",
  description:
    "Import qilinadigan telefonlar uchun bojxona to'lovlari, aksiz, QQS va xizmat haqini onlayn hisoblang.",
};

export default function CustomsCalculatorPage() {
  return <CustomsCalculatorContent />;
}
