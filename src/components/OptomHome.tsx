'use client';

import { useEffect, useMemo, useState } from 'react';
import { Boxes, Search, Tag, Check, X, ArrowRight, Sparkles, ShieldCheck, Truck, Smartphone } from 'lucide-react';
import Link from 'next/link';

import { wholesaleApi } from '../services/marketplaceApi';
import type { WholesaleProduct, WholesaleSettings, WholesaleOffer } from '../types';
import { minPriceUSD, sortedOffers, computeCost, formatSom } from '../lib/wholesale';

const TELEGRAM = 'https://t.me/olsotadmin_bot';

export function OptomHome() {
  const [products, setProducts] = useState<WholesaleProduct[]>([]);
  const [settings, setSettings] = useState<WholesaleSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<string | null>(null);
  const [selected, setSelected] = useState<WholesaleProduct | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([
          wholesaleApi.getProducts(),
          wholesaleApi.getSettings().catch(() => ({ settings: null as any })),
        ]);
        setProducts(p.products || []);
        setSettings(s.settings);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.brand && set.add(p.brand));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q)
      );
    });
  }, [products, search, brand]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container-page py-14 lg:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-400 text-xs font-bold mb-5">
            <Boxes className="w-3.5 h-3.5" /> Optom · Dubaydan
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl">
            Dubaydan optom telefonlar — sotuvchilar uchun
          </h1>
          <p className="mt-5 text-base md:text-lg text-ink-secondary dark:text-ink-dark-secondary max-w-2xl leading-relaxed">
            Kanal narxlarini ko'ring, bojxona bilan yakuniy xarajatni hisoblang va optom buyurtma bering.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link href="/ai" className="btn-primary btn-lg">
              <Sparkles className="w-4 h-4" /> AI yordamchi
            </Link>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="btn-secondary btn-lg">
              <ArrowRight className="w-4 h-4" /> Buyurtma (Telegram)
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            <Feature icon={<ShieldCheck className="w-5 h-5" />} label="Sifat: Used Tested / CPO" />
            <Feature icon={<Smartphone className="w-5 h-5" />} label="IMEI + kafolat" />
            <Feature icon={<Truck className="w-5 h-5" />} label="Kargo Dubaydan" />
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="container-page pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">Optom katalog</h2>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Model yoki brend bo'yicha qidirish"
              className="w-full pl-9 pr-3 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1C1C24] text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Chip active={!brand} onClick={() => setBrand(null)}>Hammasi</Chip>
            {brands.map((b) => (
              <Chip key={b} active={brand === b} onClick={() => setBrand((v) => (v === b ? null : b))}>{b}</Chip>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink-muted py-16">Mahsulot topilmadi</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {filtered.map((p) => {
              const min = minPriceUSD(p);
              return (
                <button
                  key={p._id}
                  onClick={() => setSelected(p)}
                  className="card p-5 text-left hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-500/15 flex items-center justify-center mb-3">
                    <Boxes className="w-5 h-5 text-brand-500" />
                  </div>
                  <p className="font-bold leading-tight line-clamp-2 min-h-[2.5rem]">{p.name}</p>
                  {(p.brand || p.note) && (
                    <p className="text-xs text-ink-muted mt-1 line-clamp-1">
                      {[p.brand, p.note].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black text-brand-500">{min != null ? `dan $${min}` : '—'}</span>
                    {p.offers?.length > 1 && (
                      <span className="text-xs text-ink-muted">{p.offers.length} taklif</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <DetailModal product={selected} settings={settings} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-500/15 text-brand-500 flex items-center justify-center">{icon}</div>
      <span className="text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary leading-tight">{label}</span>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        'px-4 h-9 rounded-full text-sm font-semibold border transition-colors ' +
        (active
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white dark:bg-[#1C1C24] border-zinc-200 dark:border-zinc-800 hover:border-brand-500/50')
      }
    >
      {children}
    </button>
  );
}

function DetailModal({
  product,
  settings,
  onClose,
}: {
  product: WholesaleProduct;
  settings: WholesaleSettings | null;
  onClose: () => void;
}) {
  const offers = useMemo(() => sortedOffers(product), [product]);
  const [idx, setIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const offer: WholesaleOffer | undefined = offers[idx];
  const cost = computeCost(offer?.priceUSD || 0, settings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#1C1C24] shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-black tracking-tight">{product.name}</h3>
            <p className="text-sm text-ink-muted">{[product.brand, product.note].filter(Boolean).join(' · ')}</p>
          </div>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink dark:text-ink-dark"><X className="w-5 h-5" /></button>
        </div>

        {/* Kanal narxlari */}
        <div className="flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">
          <Tag className="w-4 h-4" /> Kanal narxlari ({offers.length})
        </div>
        <div className="space-y-2 mb-5">
          {offers.map((o, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={
                  'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ' +
                  (active ? 'border-brand-500 bg-brand-500/10' : 'border-zinc-200 dark:border-zinc-800')
                }
              >
                <span className={'w-5 h-5 rounded-full border-2 flex items-center justify-center ' + (active ? 'bg-brand-500 border-brand-500' : 'border-zinc-300 dark:border-zinc-700')}>
                  {active && <Check className="w-3 h-3 text-white" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{o.condition || 'Taklif'}</span>
                    {i === 0 && <span className="text-[10px] font-black text-white bg-emerald-500 px-1.5 py-0.5 rounded">✓ Eng arzon</span>}
                  </div>
                  {o.variant && <span className="text-xs text-ink-muted">{o.variant}</span>}
                </div>
                <span className={'font-black ' + (active ? 'text-brand-500' : '')}>${o.priceUSD}</span>
              </button>
            );
          })}
        </div>

        {/* Xarajat hisobi */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-4">
          <p className="font-black mb-1">Taxminiy yakuniy xarajat</p>
          <p className="text-xs text-ink-muted mb-3">Bojxona + IMEI + Yo'l kira</p>
          <Row label="Qurilma narxi" value={`$${formatSom(cost.device)}`} />
          <Row label="Bojxona xarajati" value={`$${formatSom(cost.customs)}`} />
          <Row label="IMEI xarajati" value={`$${formatSom(cost.imei)}`} />
          <Row label="Yo'l kira (kargo)" value={`$${formatSom(cost.cargo)}`} />
          <Row label="Jami xarajatlar" value={`$${formatSom(cost.extra)}`} danger />
          <div className="border-t border-zinc-200 dark:border-zinc-800 my-2" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Jami to'lov</span>
            <span className="font-black text-2xl text-emerald-600">${formatSom(cost.totalUSD)}</span>
          </div>
          <p className="text-sm font-bold text-emerald-600 mt-1">≈ {formatSom(cost.totalUZS)} so'm</p>
        </div>

        {/* Miqdor */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold">Miqdor</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg bg-ink-muted/10 font-bold">−</button>
            <span className="font-black text-lg w-8 text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-lg bg-brand-500 text-white font-bold">+</button>
          </div>
        </div>
        {qty > 1 && (
          <p className="text-sm text-ink-muted mb-4">{qty} × ${formatSom(cost.totalUSD)} ≈ {formatSom(cost.totalUZS * qty)} so'm</p>
        )}

        <a href={TELEGRAM} target="_blank" rel="noreferrer" className="btn-primary btn-lg w-full justify-center">
          <ArrowRight className="w-4 h-4" /> Buyurtma berish (Telegram)
        </a>
      </div>
    </div>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={'text-sm ' + (danger ? 'text-red-500' : 'text-ink-secondary dark:text-ink-dark-secondary')}>{label}</span>
      <span className={'font-semibold ' + (danger ? 'text-red-500' : '')}>{value}</span>
    </div>
  );
}
