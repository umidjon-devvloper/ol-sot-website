'use client';

import { useUIStore } from '../store/uiStore';
import uz from '../locales/uz';
import ru from '../locales/ru';
import en from '../locales/en';

const translations = { uz, ru, en } as const;

type TranslationKeys = typeof uz;

/**
 * Hook for translations
 *
 * Usage:
 * const { t, lang } = useT();
 * <h1>{t('hero.title')}</h1>
 */
export function useT() {
  const lang = useUIStore((s) => s.language);

  /**
   * Nested key bilan tarjima olish
   * t('hero.title') -> Object'dan title olish
   */
  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations[lang] || translations.uz;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Topilmasa key'ni qaytarish
      }
    }

    return value;
  };

  return { t, lang };
}
