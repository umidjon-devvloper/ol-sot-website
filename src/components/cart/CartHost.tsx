'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useWholesaleCart } from '../../store/wholesaleCartStore';
import { wholesaleApi } from '../../services/marketplaceApi';
import { CartDrawer } from '../OptomHome';

/**
 * Global savat host — barcha sahifalarда ishlaydi.
 * uiStore.cartOpen ochilganда CartDrawer'ni ko'rsatadi.
 * Savatni hydrate qiladi (badge har joyда to'g'ri chiqsin).
 */
export function CartHost() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const hydrateCart = useWholesaleCart((s) => s.hydrate);
  const [minOrder, setMinOrder] = useState(1);

  useEffect(() => {
    hydrateCart();
    (async () => {
      try {
        const res = await wholesaleApi.getSettings();
        if (res?.settings?.minOrderQty != null) setMinOrder(res.settings.minOrderQty);
      } catch {
        /* default 1 */
      }
    })();
  }, [hydrateCart]);

  if (!cartOpen) return null;
  return <CartDrawer onClose={closeCart} minOrder={minOrder} />;
}
