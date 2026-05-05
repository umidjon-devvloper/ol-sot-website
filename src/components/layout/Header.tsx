'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  Globe,
  ChevronDown,
  LogOut,
} from 'lucide-react';

import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/cn';

export function Header() {
  const { t, lang } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, setLanguage } = useUIStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/search', label: t('nav.categories') },
    { href: '/ai', label: t('nav.ai'), highlight: true },
  ];

  const langLabels = { uz: '🇺🇿 O\'zbek', ru: '🇷🇺 Русский', en: '🇬🇧 English' };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/85 dark:bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800'
          : 'bg-white dark:bg-[#0A0A0F]'
      )}
    >
      <div className="container-page">
        <div className="flex items-center gap-4 h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/25">
              O
            </div>
            <span className="hidden sm:block text-lg font-black tracking-tight">
              Ol-sot
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 h-9 inline-flex items-center rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-zinc-100 dark:bg-[#1F1F28] text-ink dark:text-ink-dark'
                    : 'text-ink-secondary dark:text-ink-dark-secondary hover:text-ink dark:hover:text-ink-dark hover:bg-zinc-50 dark:hover:bg-[#1C1C24]',
                  link.highlight && 'text-brand-500 hover:text-brand-600'
                )}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5 mr-1" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md ml-auto"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="input pl-10 h-10"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1F1F28] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1F1F28] transition-colors flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>

              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-20 card p-1 min-w-[140px] shadow-xl animate-fade-in">
                    {(['uz', 'ru', 'en'] as const).map((lng) => (
                      <button
                        key={lng}
                        onClick={() => {
                          setLanguage(lng);
                          setLangOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          lang === lng
                            ? 'bg-brand-500 text-white'
                            : 'hover:bg-zinc-100 dark:hover:bg-[#1F1F28]'
                        )}
                      >
                        {langLabels[lng]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Favorites */}
            {user && (
              <Link
                href="/favorites"
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1F1F28] transition-colors"
                aria-label={t('nav.favorites')}
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#1F1F28] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {(user.name || user.phone).charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-20 card p-1.5 min-w-[200px] shadow-xl animate-fade-in">
                      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 mb-1">
                        <p className="text-sm font-semibold truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-ink-muted truncate">
                          {user.phone}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-[#1F1F28]"
                      >
                        <UserIcon className="w-4 h-4" />
                        {t('nav.profile')}
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-100 dark:hover:bg-[#1F1F28]"
                      >
                        <Heart className="w-4 h-4" />
                        {t('nav.favorites')}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link href="/login" className="btn-ghost btn-sm">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn-primary btn-sm">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1F1F28]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="input pl-10 h-10"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0F] animate-slide-up">
          <nav className="container-page py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-zinc-100 dark:bg-[#1F1F28]'
                    : 'hover:bg-zinc-50 dark:hover:bg-[#1C1C24]',
                  link.highlight && 'text-brand-500'
                )}
              >
                {link.highlight && <Sparkles className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}

            {/* Language switcher in mobile */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <p className="px-3 text-xs uppercase tracking-wider text-ink-muted font-bold mb-2">
                {t('profile.language')}
              </p>
              <div className="flex gap-2 px-3">
                {(['uz', 'ru', 'en'] as const).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => setLanguage(lng)}
                    className={cn(
                      'flex-1 px-3 h-9 rounded-md text-xs font-bold transition-colors',
                      lang === lng
                        ? 'bg-brand-500 text-white'
                        : 'bg-zinc-100 dark:bg-[#1F1F28]'
                    )}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <Link href="/login" className="btn-secondary btn-md flex-1">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="btn-primary btn-md flex-1">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
