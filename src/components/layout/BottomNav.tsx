'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldCheck, ShoppingCart, Heart, User } from 'lucide-react';
import { useT } from '../../hooks/useT';
import { cn } from '../../lib/cn';
import { useUIStore } from '../../store/uiStore';
import { useWholesaleCart } from '../../store/wholesaleCartStore';

type Tab =
  | { type: 'link'; href: string; icon: typeof Home; labelKey: string }
  | { type: 'cart'; icon: typeof Home; labelKey: string };

const TABS: Tab[] = [
  { type: 'link', href: '/', icon: Home, labelKey: 'nav.home' },
  { type: 'link', href: '/grades', icon: ShieldCheck, labelKey: 'nav.grades' },
  { type: 'cart', icon: ShoppingCart, labelKey: 'nav.cart' },
  { type: 'link', href: '/favorites', icon: Heart, labelKey: 'nav.favorites' },
  { type: 'link', href: '/profile', icon: User, labelKey: 'nav.profile' },
];

const itemBase =
  'relative flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition-colors';

/**
 * Ilovadagi kabi pastki tab bar — faqat mobil/planshet (lg dan past).
 * Markazда Savat: bosilganда drawer ochiladi (sahifaga o'tmaydi), badge sonini ko'rsatadi.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();
  const openCart = useUIStore((s) => s.openCart);
  const cartItems = useWholesaleCart((s) => s.items);
  const cartCount = Object.values(cartItems).filter((i) => i.quantity > 0).length;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#13131A]/90 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          if (tab.type === 'cart') {
            return (
              <button
                key="cart"
                type="button"
                onClick={openCart}
                aria-label={t(tab.labelKey)}
                className={cn(
                  itemBase,
                  'text-ink-muted dark:text-ink-dark-muted hover:text-brand-500'
                )}
              >
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-black leading-none text-white">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate px-0.5">{t(tab.labelKey)}</span>
              </button>
            );
          }

          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={t(tab.labelKey)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                itemBase,
                active
                  ? 'text-brand-500'
                  : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
              )}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-500" />
              )}
              <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.5 : 2} />
              <span className="max-w-full truncate px-0.5">{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
