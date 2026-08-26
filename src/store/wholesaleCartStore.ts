'use client';

import { create } from 'zustand';

const KEY = 'wholesale_cart_v1';

export interface CartItem {
  name: string;
  condition: string;
  variant: string;
  priceUSD: number | null;
  quantity: number;
}

interface State {
  items: Record<string, CartItem>;
  hydrated: boolean;
  hydrate: () => void;
  setLine: (id: string, item: CartItem) => void;
  setQuantity: (id: string, q: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const save = (items: Record<string, CartItem>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
};

export const useWholesaleCart = create<State>((set, get) => ({
  items: {},
  hydrated: false,
  hydrate: () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
      const items = raw ? JSON.parse(raw) : {};
      set({ items: items && typeof items === 'object' ? items : {}, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  setLine: (id, item) => {
    const items = { ...get().items };
    const q = Math.max(0, Math.floor(item.quantity || 0));
    if (q <= 0) delete items[id];
    else items[id] = { ...item, quantity: q };
    set({ items });
    save(items);
  },
  setQuantity: (id, q) => {
    const ex = get().items[id];
    if (!ex) return;
    get().setLine(id, { ...ex, quantity: q });
  },
  remove: (id) => {
    const items = { ...get().items };
    delete items[id];
    set({ items });
    save(items);
  },
  clear: () => {
    set({ items: {} });
    save({});
  },
}));
