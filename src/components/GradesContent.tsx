"use client";

import { ShieldCheck, Check, Users, Sparkles } from "lucide-react";
import { GRADES } from "@/lib/grades";
import { useT } from "@/hooks/useT";

export default function GradesContent() {
  const { t } = useT();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 pt-16 pb-20">
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-300 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-400 blur-3xl" />
        </div>
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            <Sparkles size={14} />
            {t("grades.subtitle")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-ink dark:text-ink-dark text-balance">
            {t("grades.heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {t("grades.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Grades grid */}
      <section className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GRADES.map((g) => (
            <article
              key={g.key}
              className={`card border-2 ${g.border} overflow-hidden group hover:-translate-y-1 transition-transform`}
            >
              <div
                className="px-6 py-5 flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg, ${g.color}15, transparent)`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: `${g.color}22` }}
                >
                  {g.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black tracking-tight text-ink dark:text-ink-dark">
                      {g.code}
                    </h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: g.color }}
                    >
                      {t(`${g.i18nKey}.badge`)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {t(`${g.i18nKey}.warranty`)}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-base text-ink dark:text-ink-dark leading-relaxed">
                  {t(`${g.i18nKey}.description`)}
                </p>

                <InfoLine
                  label={t("grades.conditionLabel")}
                  text={t(`${g.i18nKey}.condition`)}
                  color={g.color}
                />
                <InfoLine
                  label={t("grades.audienceLabel")}
                  text={t(`${g.i18nKey}.audience`)}
                  color={g.color}
                  icon={<Users size={14} />}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Warranty policy */}
      <section className="container-page pb-24">
        <div className="card border-2 border-brand-500/30 bg-brand-50 dark:bg-brand-900/20 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-ink dark:text-ink-dark">
              {t("grades.warrantyTitle")}
            </h3>
          </div>

          <p className="text-base font-semibold text-ink dark:text-ink-dark mb-4">
            {t("grades.warrantyGuaranteed")}:
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              "warrantyCamera",
              "warrantyMic",
              "warrantyFaceId",
              "warrantyParts",
              "warrantyScreen",
            ].map((k) => (
              <li key={k} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Check className="text-emerald-500 shrink-0" size={18} />
                <span>{t(`grades.${k}`)}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-4 flex gap-3">
            <span className="text-2xl">📦</span>
            <p className="text-sm text-ink dark:text-ink-dark">
              {t("grades.warrantyAsIsNote")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoLine({
  label,
  text,
  color,
  icon,
}: {
  label: string;
  text: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {icon || <span className="text-xs font-bold">•</span>}
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-0.5">
          {label}
        </div>
        <div className="text-sm text-ink dark:text-ink-dark leading-relaxed">{text}</div>
      </div>
    </div>
  );
}
