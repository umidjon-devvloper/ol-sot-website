"use client";

import { useMemo, useState } from "react";
import { Calculator, Info, DollarSign } from "lucide-react";
import { useT } from "@/hooks/useT";
import { formatUsd } from "@/utils/format";

/**
 * Rastamojka formulasi placeholder.
 * User keyinroq aniq foizlarni beradi.
 */
const CUSTOMS_DUTY_PCT = 0;
const EXCISE_PCT = 0;
const VAT_PCT = 12;
const SERVICE_FEE_USD = 30;

export default function CustomsCalculatorContent() {
  const { t } = useT();
  const [priceStr, setPriceStr] = useState("");
  const [calculated, setCalculated] = useState(false);
  const price = parseFloat(priceStr) || 0;

  const result = useMemo(() => {
    if (!price) return null;
    const duty = (price * CUSTOMS_DUTY_PCT) / 100;
    const excise = (price * EXCISE_PCT) / 100;
    const vat = ((price + duty + excise) * VAT_PCT) / 100;
    const service = SERVICE_FEE_USD;
    const total = price + duty + excise + vat + service;
    return { duty, excise, vat, service, total };
  }, [price]);

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 pt-16 pb-14">
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
            <Calculator size={14} />
            {t("customs.subtitle")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-ink dark:text-ink-dark text-balance">
            {t("customs.title")}
          </h1>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Input card */}
          <div className="lg:col-span-2 card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-500">
                <Calculator size={22} />
              </div>
              <div className="uppercase tracking-wider text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t("customs.phonePrice")}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 h-16">
              <DollarSign className="text-neutral-500" size={22} />
              <input
                type="text"
                inputMode="decimal"
                value={priceStr}
                onChange={(e) => {
                  setPriceStr(e.target.value.replace(/[^0-9.]/g, ""));
                  setCalculated(false);
                }}
                placeholder={t("customs.phonePricePlaceholder")}
                className="flex-1 bg-transparent outline-none text-2xl font-bold tabular-nums text-ink dark:text-ink-dark placeholder:text-neutral-400"
              />
            </div>

            <button
              onClick={() => price && setCalculated(true)}
              disabled={!price}
              className="btn-primary btn-lg w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("customs.calculate")}
            </button>

            <div className="mt-6 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex gap-3">
              <Info className="text-blue-500 shrink-0" size={18} />
              <p className="text-sm text-ink dark:text-ink-dark">
                {t("customs.note")}
              </p>
            </div>
          </div>

          {/* Result card */}
          <div className="lg:col-span-3 card p-6 md:p-8">
            <h2 className="text-xl font-bold text-ink dark:text-ink-dark mb-6">
              {t("customs.result")}
            </h2>

            {!calculated || !result ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <Calculator className="text-neutral-400" size={28} />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-xs">
                  {t("customs.phonePricePlaceholder")}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <ResultRow
                  label={t("customs.customsDuty")}
                  value={`$${formatUsd(result.duty)}`}
                />
                <ResultRow
                  label={t("customs.excise")}
                  value={`$${formatUsd(result.excise)}`}
                />
                <ResultRow
                  label={t("customs.vat")}
                  value={`$${formatUsd(result.vat)}`}
                />
                <ResultRow
                  label={t("customs.serviceFee")}
                  value={`$${formatUsd(result.service)}`}
                />

                <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-4" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-lg font-bold text-ink dark:text-ink-dark">
                    {t("customs.totalCost")}
                  </span>
                  <span className="text-3xl font-black tracking-tight text-brand-500 tabular-nums">
                    ${formatUsd(result.total)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="mt-12 card p-8">
          <h3 className="text-2xl font-bold tracking-tight text-ink dark:text-ink-dark mb-3">
            {t("customs.infoTitle")}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t("customs.infoBody")}
          </p>
        </div>
      </section>
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold tabular-nums text-ink dark:text-ink-dark">
        {value}
      </span>
    </div>
  );
}
