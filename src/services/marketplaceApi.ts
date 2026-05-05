'use client';

import api from './api';
import { Product, Category, AuthResponse, User } from '../types';

interface RegisterData {
  phone: string;
  password: string;
  name?: string;
  language?: 'uz' | 'ru' | 'en';
}

interface LoginData {
  phone: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  avatar?: string;
  language?: 'uz' | 'ru' | 'en';
  notificationSettings?: User['notificationSettings'];
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response: any = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response: any = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response: any = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: User }> => {
    const response: any = await api.patch('/auth/me', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return await api.post('/auth/change-password', { currentPassword, newPassword });
  },
};

interface ProductsParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface PaginatedResponse<T> {
  products: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const productApi = {
  getProducts: async (params: ProductsParams = {}): Promise<PaginatedResponse<Product>> => {
    const response: any = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<{ product: Product; similar: Product[] }> => {
    const response: any = await api.get(`/products/${id}`);
    return response.data;
  },
};

export const categoryApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response: any = await api.get('/categories');
    return response.data;
  },
};

export const favoriteApi = {
  getFavorites: async (page = 1, limit = 20): Promise<PaginatedResponse<Product>> => {
    const response: any = await api.get('/favorites', { params: { page, limit } });
    return response.data;
  },

  toggleFavorite: async (productId: string): Promise<{ isFavorite: boolean }> => {
    const response: any = await api.post(`/favorites/${productId}`);
    return response.data;
  },
};

export const aiApi = {
  ask: async (
    message: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<{ message: string; recommendedProducts: Product[] }> => {
    const response: any = await api.post('/ai/ask', { message, history });
    return response.data;
  },
};
