'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { Config } from '../lib/config';
import { authApi } from '../services/marketplaceApi';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  register: (data: { phone: string; password: string; name?: string; language?: any }) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const token = Cookies.get(Config.STORAGE.TOKEN);

      if (token) {
        try {
          const { user } = await authApi.getMe();
          set({ token, user, isInitialized: true });
        } catch {
          Cookies.remove(Config.STORAGE.TOKEN);
          set({ isInitialized: true });
        }
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.register(data);
      Cookies.set(Config.STORAGE.TOKEN, token, { expires: 30, sameSite: 'lax' });
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.login({ phone, password });
      Cookies.set(Config.STORAGE.TOKEN, token, { expires: 30, sameSite: 'lax' });
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove(Config.STORAGE.TOKEN);
    set({ user: null, token: null });
  },

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...updates } });
  },

  refreshUser: async () => {
    try {
      const { user } = await authApi.getMe();
      set({ user });
    } catch {}
  },
}));
