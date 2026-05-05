'use client';

import Link from 'next/link';
import { useT } from '../../hooks/useT';

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  const sections = [
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), href: '/about' },
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.careers'), href: '/careers' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.help'), href: '/help' },
        { label: t('footer.delivery'), href: '/delivery' },
        { label: t('footer.returns'), href: '/returns' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.privacy'), href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0F]">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/25">
                O
              </div>
              <span className="text-lg font-black tracking-tight">Ol-sot</span>
            </Link>
            <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-secondary dark:text-ink-dark-secondary hover:text-brand-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <p className="text-xs text-ink-muted dark:text-ink-dark-muted">
            © {year} Marketplace. {t('footer.rights')}.
          </p>
          <div className="flex gap-2 text-xs text-ink-muted dark:text-ink-dark-muted">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>in Tashkent</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
