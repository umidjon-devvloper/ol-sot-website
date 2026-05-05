'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Languages, Moon, Sun, LogOut, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../services/marketplaceApi';
import { formatPhone } from '../../utils/format';
import { cn } from '../../lib/cn';

export default function ProfilePage() {
  const { t } = useT();
  const router = useRouter();
  const { user, logout, updateUser, isInitialized } = useAuthStore();
  const { theme, toggleTheme, language, setLanguage } = useUIStore();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/login');
      return;
    }
    if (user) setName(user.name);
  }, [user, isInitialized, router]);

  if (!user) return null;

  const handleSaveName = async () => {
    if (name.trim() === user.name) return;
    try {
      setSaving(true);
      await authApi.updateProfile({ name: name.trim() });
      updateUser({ name: name.trim() });
      toast.success(t('common.save'));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (lng: 'uz' | 'ru' | 'en') => {
    setLanguage(lng);
    try {
      await authApi.updateProfile({ language: lng });
      updateUser({ language: lng });
    } catch {}
  };

  return (
    <div className="container-page py-8 lg:py-12 max-w-2xl">
      <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-8">
        {t('profile.title')}
      </h1>

      <div className="space-y-6">
        {/* User card */}
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-brand-500/30">
              {(user.name || user.phone).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-bold">{user.name || 'No name'}</p>
              <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                {formatPhone(user.phone)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('auth.name')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input flex-1"
                  placeholder="Ismingiz"
                />
                <Button
                  onClick={handleSaveName}
                  loading={saving}
                  disabled={name.trim() === user.name}
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="card p-6">
          <h3 className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-ink-muted mb-4">
            <Moon className="w-3.5 h-3.5" />
            {t('profile.theme')}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                'p-4 rounded-xl flex items-center gap-3 transition-all',
                theme === 'light'
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100 dark:bg-[#1F1F28] hover:bg-zinc-200 dark:hover:bg-[#27272A]'
              )}
            >
              <Sun className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('profile.themeLight')}</span>
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                'p-4 rounded-xl flex items-center gap-3 transition-all',
                theme === 'dark'
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100 dark:bg-[#1F1F28] hover:bg-zinc-200 dark:hover:bg-[#27272A]'
              )}
            >
              <Moon className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('profile.themeDark')}</span>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="card p-6">
          <h3 className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-ink-muted mb-4">
            <Globe className="w-3.5 h-3.5" />
            {t('profile.language')}
          </h3>

          <div className="space-y-2">
            {(
              [
                { code: 'uz', label: '🇺🇿 O\'zbek' },
                { code: 'ru', label: '🇷🇺 Русский' },
                { code: 'en', label: '🇬🇧 English' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.code}
                onClick={() => handleLanguageChange(opt.code)}
                className={cn(
                  'w-full p-4 rounded-xl flex items-center justify-between text-sm font-semibold transition-all',
                  language === opt.code
                    ? 'bg-brand-500 text-white'
                    : 'bg-zinc-100 dark:bg-[#1F1F28] hover:bg-zinc-200 dark:hover:bg-[#27272A]'
                )}
              >
                <span>{opt.label}</span>
                {language === opt.code && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          size="lg"
          onClick={() => {
            logout();
            router.push('/');
          }}
          icon={<LogOut className="w-4 h-4" />}
        >
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );
}
