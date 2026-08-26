import type { WholesaleProduct, WholesaleOffer, WholesaleSettings } from '../types';

export const getOffers = (p: WholesaleProduct): WholesaleOffer[] => {
  if (p.offers && p.offers.length > 0) return p.offers;
  if (p.priceUSD != null) return [{ condition: '', variant: p.note || '', priceUSD: p.priceUSD }];
  return [];
};

export const sortedOffers = (p: WholesaleProduct): WholesaleOffer[] =>
  [...getOffers(p)].sort((a, b) => a.priceUSD - b.priceUSD);

export const cheapestOffer = (p: WholesaleProduct): WholesaleOffer | null => {
  const o = sortedOffers(p);
  return o.length > 0 ? o[0] : null;
};

export const minPriceUSD = (p: WholesaleProduct): number | null => {
  const o = cheapestOffer(p);
  return o ? o.priceUSD : null;
};

export interface CostBreakdown {
  device: number;
  customs: number;
  imei: number;
  cargo: number;
  extra: number;
  totalUSD: number;
  totalUZS: number;
  combined: boolean;
}

const DEFAULT_SETTINGS: WholesaleSettings = {
  customsPercent: 16.8,
  imeiUSD: 15,
  cargoUSD: 7,
  usdToUzs: 12600,
  minOrderQty: 4,
};

export const computeCost = (
  priceUSD: number,
  settings?: WholesaleSettings | null,
  extraOverride?: number | null
): CostBreakdown => {
  const s = settings || DEFAULT_SETTINGS;
  const device = priceUSD || 0;
  const combined = extraOverride != null && extraOverride > 0;
  let customs = 0;
  let imei = 0;
  let cargo = 0;
  let extra: number;
  if (combined) {
    extra = extraOverride as number;
  } else {
    customs = (device * (s.customsPercent || 0)) / 100;
    imei = s.imeiUSD || 0;
    cargo = s.cargoUSD || 0;
    extra = customs + imei + cargo;
  }
  const totalUSD = device + extra;
  const totalUZS = totalUSD * (s.usdToUzs || 0);
  return { device, customs, imei, cargo, extra, totalUSD, totalUZS, combined };
};

export const formatSom = (n: number): string =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
