'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldCheck, Sparkles, Heart, User } from 'lucide-react';
import { useT } from '../../hooks/useT';
import { cn } from '../../lib/cn';

const TABS = [
  { href: '/', icon: Home, labelKey: 'nav.home' },
  { href: '/grades', icon: ShieldCheck, labelKey: 'nav.grades' },
  { href: '/ai', icon: Sparkles, labelKey: 'nav.aiShort' },
  { href: '/favorites', icon: Heart, labelKey: 'nav.favorites' },
  { href: '/profile', icon: User, labelKey: 'nav.profile' },
] as const;

/**
 * Ilovadagi kabi pastki tab bar — faqat mobil/planshet (lg dan past).
 * Desktopda tepadagi Header nav ko'rinadi.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#13131A]/90 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const active =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={t(tab.labelKey)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition-colors',
                active
                  ? 'text-brand-500'
                  : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
              )}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-500" />
              )}
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="max-w-full truncate px-0.5">{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
