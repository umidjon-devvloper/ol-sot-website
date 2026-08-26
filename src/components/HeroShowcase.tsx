'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, PackageCheck } from 'lucide-react';

import { Product } from '../types';
import { useT } from '../hooks/useT';
import { formatPrice, getML } from '../utils/format';
import { getGradeInfo } from '../lib/grades';

/**
 * Hero vizuali - haqiqiy mahsulotlardan yasalgan "yelpig'ich" kartochkalar.
 *
 * Ilgari bu yerda CSS bilan chizilgan soxta iPhone'lar turgan edi. Endi
 * omborimizdagi rostakam tovarlar o'z grad belgisi bilan ko'rinadi - bu ham
 * chiroyliroq, ham "Ol-Sot saralab beradi" degan asosiy g'oyani bir qarashda
 * tushuntiradi.
 *
 * MUHIM: har bir bo'lak uch qatlamdan iborat:
 *   1) o'rin      - absolute + markazlash (transform: -translate-y-1/2)
 *   2) suzish     - faqat animatsiya (transform: translateY)
 *   3) ko'rinish  - burilish/kichraytirish (transform: rotate/scale)
 * Uchalasi ham `transform` ga tegadi, shuning uchun bitta elementga
 * yig'ilsa biri ikkinchisini bekor qiladi.
 */
export function HeroShowcase({ products }: { products: Product[] }) {
  const { t, lang } = useT();

  const deck = products.filter((p) => p.thumbnail).slice(0, 3);
  if (deck.length === 0) return null;

  const [front, ...behind] = deck;
  const frontGrade = getGradeInfo(front.grade);
  const frontPrice = front.discountPrice || front.price;

  return (
    <div className="relative hidden lg:block">
      <div className="relative h-[430px] max-w-[420px] mx-auto">
        {/* Orqadagi kartochkalar */}
        {behind.map((p, i) => {
          const g = getGradeInfo(p.grade);
          const look = i === 0
            ? 'translate-x-[4.5rem] -translate-y-6 rotate-6 scale-[0.84] opacity-70'
            : '-translate-x-[4.5rem] translate-y-3 -rotate-6 scale-[0.74] opacity-45';

          return (
            <div
              key={p._id}
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[250px]"
            >
              <div className={`hero-drift ${i === 0 ? 'hero-drift-b' : 'hero-drift-c'}`}>
                <div className={`card overflow-hidden ${look}`}>
                  <div className="relative aspect-square bg-zinc-100 dark:bg-[#1F1F28]">
                    <Image
                      src={p.thumbnail!}
                      alt=""
                      fill
                      sizes="250px"
                      className="object-contain p-5"
                    />
                    {g && (
                      <span
                        className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-white text-[10px] font-black tracking-wider"
                        style={{ backgroundColor: g.color }}
                      >
                        {g.code}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Old kartochka */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[270px] z-10">
          <div className="hero-drift hero-drift-a">
            <Link
              href={`/product/${front._id}`}
              className="card group block overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-2xl shadow-brand-500/20"
            >
              <div className="relative aspect-square bg-zinc-100 dark:bg-[#1F1F28]">
                <Image
                  src={front.thumbnail!}
                  alt={getML(front.title, lang)}
                  fill
                  sizes="270px"
                  priority
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
                {frontGrade && (
                  <span
                    className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-black tracking-wide shadow-lg"
                    style={{ backgroundColor: frontGrade.color }}
                  >
                    <span aria-hidden="true">{frontGrade.emoji}</span>
                    {frontGrade.code}
                  </span>
                )}
              </div>

              <div className="px-4 py-3">
                {front.brand && (
                  <p className="text-[10px] font-bold tracking-[0.14em] text-ink-muted dark:text-ink-dark-muted uppercase">
                    {front.brand}
                  </p>
                )}
                <h2 className="mt-0.5 text-sm font-semibold leading-snug line-clamp-1">
                  {getML(front.title, lang)}
                </h2>
                <p className="mt-1.5 text-lg font-black tracking-tight tabular-nums">
                  {formatPrice(frontPrice)}
                  <span className="ml-1 text-xs font-medium text-ink-muted dark:text-ink-dark-muted">
                    {t('common.sum')}
                  </span>
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Ishonch belgilari */}
        <div className="absolute left-0 top-12 z-20">
          <div className="hero-drift hero-drift-c">
            <div className="card flex items-center gap-2 px-3 py-2 shadow-xl">
              <PackageCheck className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-xs font-bold whitespace-nowrap">
                {t('grades.title')}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-1 -bottom-3 z-20">
          <div className="hero-drift hero-drift-b">
            <div className="card flex items-center gap-2 px-3 py-2 shadow-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold whitespace-nowrap">
                {t('grades.s1.warranty')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
