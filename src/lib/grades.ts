import type { ProductGrade } from "../types";

export interface GradeInfo {
  key: ProductGrade;
  code: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  i18nKey: "grades.s_plus" | "grades.s1" | "grades.cpo" | "grades.as_is";
}

export const GRADES: GradeInfo[] = [
  {
    key: "s_plus",
    code: "S+",
    emoji: "⭐",
    color: "#10B981",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    i18nKey: "grades.s_plus",
  },
  {
    key: "s1",
    code: "S1",
    emoji: "✨",
    color: "#3B82F6",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    i18nKey: "grades.s1",
  },
  {
    key: "cpo",
    code: "CPO",
    emoji: "🍏",
    color: "#8B5CF6",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    i18nKey: "grades.cpo",
  },
  {
    key: "as_is",
    code: "AS-IS",
    emoji: "📦",
    color: "#F59E0B",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    i18nKey: "grades.as_is",
  },
];

export const getGradeInfo = (key?: ProductGrade | null): GradeInfo | undefined =>
  GRADES.find((g) => g.key === key);
