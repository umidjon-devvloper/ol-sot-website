"use client";

import {
  Wallet,
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  Clock,
} from "lucide-react";
import { GRADES } from "@/lib/grades";
import { useT } from "@/hooks/useT";

/**
 * Xizmat haqi placeholder qiymatlari.
 * User keyinroq aniq raqamlarni beradi.
 */
const GRADE_FEES: Record<string, string> = {
  s_plus: "$0",
  s1: "$0",
  cpo: "$3",
  as_is: "$2",
};

export default function ServiceFeesContent() {
  const { t } = useT();

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 pt-16 pb-14">
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-4">
            <Wallet size={14} />
            {t("serviceFees.subtitle")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-ink dark:text-ink-dark text-balance">
            {t("serviceFees.title")}
          </h1>
        </div>
      </section>

      <section className="container-page py-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade fees */}
        <SectionCard
          icon={<ShieldCheck size={22} />}
          color="#FF6B35"
          title={t("serviceFees.gradeFeesTitle")}
        >
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {GRADES.map((g) => (
              <li key={g.key} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className="px-2.5 py-1 rounded-md text-white text-xs font-black min-w-[54px] text-center"
                    style={{ backgroundColor: g.color }}
                  >
                    {g.code}
                  </span>
                  <span className="text-ink dark:text-ink-dark font-medium">
                    {t(`${g.i18nKey}.badge`)}
                  </span>
                </div>
                <span className="text-lg font-bold text-brand-500 tabular-nums">
                  {GRADE_FEES[g.key]}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Delivery */}
        <SectionCard
          icon={<Truck size={22} />}
          color="#3B82F6"
          title={t("serviceFees.deliveryTitle")}
        >
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            <li className="flex items-center gap-2 py-3.5">
              <Truck size={16} className="text-brand-500 shrink-0" />
              <span className="text-ink dark:text-ink-dark font-medium">
                {t("serviceFees.deliveryCity")}
              </span>
            </li>
            <li className="flex items-center gap-2 py-3.5">
              <Truck size={16} className="text-brand-500 shrink-0" />
              <span className="text-ink dark:text-ink-dark font-medium">
                {t("serviceFees.deliveryRegion")}
              </span>
            </li>
          </ul>
        </SectionCard>

        {/* Warranty */}
        <SectionCard
          icon={<Clock size={22} />}
          color="#10B981"
          title={t("serviceFees.warrantyTitle")}
        >
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {GRADES.map((g) => (
              <li key={g.key} className="flex items-center justify-between py-3.5">
                <span
                  className="px-2.5 py-1 rounded-md text-white text-xs font-black min-w-[54px] text-center"
                  style={{ backgroundColor: g.color }}
                >
                  {g.code}
                </span>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 text-right ml-3">
                  {t(`${g.i18nKey}.warranty`)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Payment methods */}
        <SectionCard
          icon={<CreditCard size={22} />}
          color="#8B5CF6"
          title={t("serviceFees.paymentTitle")}
        >
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            <PaymentRow
              icon={<CreditCard className="text-blue-500" size={18} />}
              label={t("serviceFees.paymentTransfer")}
            />
            <PaymentRow
              icon={<Banknote className="text-emerald-500" size={18} />}
              label={t("serviceFees.paymentCash")}
            />
          </ul>
        </SectionCard>
      </section>
    </main>
  );
}

function SectionCard({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {icon}
        </div>
        <h2 className="text-lg font-bold text-ink dark:text-ink-dark tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function PaymentRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3 py-3.5">
      {icon}
      <span className="text-ink dark:text-ink-dark font-medium">{label}</span>
    </li>
  );
}
