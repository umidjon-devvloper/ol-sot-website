'use client';

import { create } from 'zustand';

type Theme = 'light' | 'dark';
type Language = 'uz' | 'ru' | 'en';

interface UIState {
  theme: Theme;
  language: Language;

  initialize: () => void;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
}

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'light',
  language: 'uz',

  initialize: () => {
    if (typeof window === 'undefined') return;

    // Theme
    const savedTheme = (localStorage.getItem('theme') as Theme | null) || null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemDark ? 'dark' : 'light');
    applyTheme(theme);

    // Language
    const savedLang = (localStorage.getItem('language') as Language | null) || null;
    const navLang = navigator.language?.slice(0, 2) as Language;
    const language = savedLang || (['uz', 'ru', 'en'].includes(navLang) ? navLang : 'uz');

    set({ theme, language });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },

  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
}));
