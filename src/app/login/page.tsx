'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { normalizePhone } from '../../utils/format';

export default function LoginPage() {
  const { t } = useT();
  const router = useRouter();
  const { user, login, isInitialized } = useAuthStore();

  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      router.replace('/');
    }
  }, [user, isInitialized, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const normalized = normalizePhone(phone);
    const newErrors: typeof errors = {};

    if (!/^\+998\d{9}$/.test(normalized)) {
      newErrors.phone = t('auth.invalidPhone');
    }
    if (password.length < 6) {
      newErrors.password = t('auth.invalidPassword');
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await login(normalized, password);
      toast.success(t('auth.welcome'));
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12 lg:py-20">
      <div className="max-w-md mx-auto">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -z-10" />

        <div className="card p-8 lg:p-10 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-brand mb-4 shadow-lg shadow-brand-500/30">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-2">
              {t('auth.loginTitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.phone')}
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone}
            />

            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-ink-muted" />
                  ) : (
                    <Eye className="w-4 h-4 text-ink-muted" />
                  )}
                </button>
              }
              error={errors.password}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-6"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              {t('auth.login')}
            </Button>
          </form>

          <p className="text-sm text-center text-ink-secondary dark:text-ink-dark-secondary mt-8">
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="font-bold text-brand-500 hover:text-brand-600">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
