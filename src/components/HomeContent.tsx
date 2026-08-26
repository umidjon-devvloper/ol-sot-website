'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight, Zap, Shield, Truck, Award, Calculator, Wallet } from 'lucide-react';

import { Product, Category } from '../types';
import { ProductCard } from './product/ProductCard';
import { useT } from '../hooks/useT';
import { getML } from '../utils/format';
import { ProductCardSkeleton } from './ui';
import { GRADES } from '../lib/grades';
import { HeroShowcase } from './HeroShowcase';

interface HomeContentProps {
  featured: Product[];
  newest: Product[];
  categories: Category[];
}

export function HomeContent({ featured, newest, categories }: HomeContentProps) {
  const { t, lang } = useT();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-page py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI yordamchi mavjud</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-balance">
                {t('hero.title')}
              </h1>

              <p className="mt-6 text-base md:text-lg text-ink-secondary dark:text-ink-dark-secondary max-w-xl leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/search" className="btn-primary btn-lg">
                  {t('hero.explore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/ai" className="btn-secondary btn-lg">
                  <Sparkles className="w-4 h-4" />
                  {t('hero.aiHelp')}
                </Link>
              </div>

              {/* Features list */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <Feature icon={<Zap className="w-5 h-5" />} label="Tezkor yetkazish" />
                <Feature icon={<Shield className="w-5 h-5" />} label="Sifat kafolati" />
                <Feature icon={<Truck className="w-5 h-5" />} label="Bepul dostavka" />
              </div>
            </div>

            {/* Hero visual - haqiqiy mahsulotlar */}
            <HeroShowcase products={[...featured, ...newest]} />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page py-12 lg:py-16">
          <SectionHeader title={t('home.categories')} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
            {categories.slice(0, 12).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat._id}`}
                className="group card p-4 lg:p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500/50 transition-all duration-300 text-center"
              >
                <div className="text-3xl lg:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon || '📦'}
                </div>
                <p className="text-xs lg:text-sm font-semibold line-clamp-1">
                  {getML(cat.name, lang)}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {cat.productCount || 0}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Grades quick section */}
      <section className="container-page py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
              {t('grades.title')}
            </h2>
            <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-1">
              {t('grades.subtitle')}
            </p>
          </div>
          <Link
            href="/grades"
            className="text-sm font-semibold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
          >
            {t('common.seeAll')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {GRADES.map((g) => (
            <Link
              key={g.key}
              href={`/search?grade=${g.key}`}
              className="card p-4 lg:p-5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${g.color}22` }}
                >
                  {g.emoji}
                </div>
                <div>
                  <div className="text-lg font-black tracking-tight">{g.code}</div>
                  <div className="text-xs text-neutral-500">
                    {t(`${g.i18nKey}.badge`)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-ink-secondary dark:text-ink-dark-secondary line-clamp-2 leading-relaxed">
                {t(`${g.i18nKey}.warranty`)}
              </p>
            </Link>
          ))}
        </div>

        {/* Info shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link
            href="/customs-calculator"
            className="card p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-ink dark:text-ink-dark">
                {t('customs.title')}
              </div>
              <div className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-0.5">
                {t('customs.subtitle')}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </Link>

          <Link
            href="/service-fees"
            className="card p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-ink dark:text-ink-dark">
                {t('serviceFees.title')}
              </div>
              <div className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-0.5">
                {t('serviceFees.subtitle')}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </Link>
        </div>
      </section>

      {/* AI Banner */}
      <section className="container-page py-8">
        <Link
          href="/ai"
          className="block relative overflow-hidden rounded-3xl bg-gradient-purple p-8 lg:p-12 group"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 right-40 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                {t('home.aiBanner.title')}
              </h3>
              <p className="mt-2 text-sm lg:text-base text-white/90 max-w-2xl">
                {t('home.aiBanner.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 px-5 h-12 rounded-xl bg-white text-purple-600 font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
              {t('home.aiBanner.action')}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container-page py-12 lg:py-16">
          <SectionHeader title={t('home.featured')} href="/search?featured=true" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newest.length > 0 && (
        <section className="container-page py-12 lg:py-16">
          <SectionHeader title={t('home.newArrivals')} href="/search?sort=newest" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
            {newest.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state if no data */}
      {featured.length === 0 && newest.length === 0 && categories.length === 0 && (
        <section className="container-page py-20 text-center">
          <p className="text-ink-secondary">Backend ulanishi yo'q yoki mahsulot topilmadi</p>
          <p className="text-xs text-ink-muted mt-2">
            Backend ishlayotganini tekshiring va seed bilan ma'lumotlarni qo'shing
          </p>
        </section>
      )}
    </>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  const { t } = useT();
  return (
    <div className="flex items-center justify-between mb-6 lg:mb-8">
      <h2 className="text-2xl lg:text-3xl font-black tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          {t('common.seeAll')}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#1F1F28] flex items-center justify-center text-brand-500">
        {icon}
      </div>
      <p className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary">
        {label}
      </p>
    </div>
  );
}
