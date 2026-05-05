import { Config } from '../lib/config';

/**
 * Server-side fetch wrapper
 *
 * Next.js server komponentlar va metadata uchun.
 * Cache control va revalidation qo'shilgan.
 */
interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

export async function serverFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags, ...rest } = options;

  const url = `${Config.API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...rest.headers,
      },
      next: {
        revalidate: revalidate === false ? undefined : revalidate,
        tags,
      },
    });

    if (!response.ok) {
      throw new Error(`API xato: ${response.status}`);
    }

    const data = await response.json();
    return data.data ?? data;
  } catch (error) {
    console.error('Server fetch xato:', endpoint, error);
    throw error;
  }
}

/**
 * Mahsulotlar uchun server-side helper'lar
 */
export const serverApi = {
  /**
   * Featured va yangi mahsulotlar (home page uchun)
   */
  async getHomeData() {
    try {
      const [featured, newest, categories] = await Promise.all([
        serverFetch<any>('/products?featured=true&limit=8', { revalidate: 300 }),
        serverFetch<any>('/products?sort=newest&limit=8', { revalidate: 60 }),
        serverFetch<any>('/categories', { revalidate: 600 }),
      ]);

      return {
        featured: featured?.products || [],
        newest: newest?.products || [],
        categories: categories?.categories || [],
      };
    } catch {
      return { featured: [], newest: [], categories: [] };
    }
  },

  /**
   * Bitta mahsulot
   */
  async getProduct(id: string) {
    try {
      return await serverFetch<any>(`/products/${id}`, { revalidate: 60 });
    } catch {
      return null;
    }
  },

  /**
   * Kategoriya bo'yicha mahsulotlar
   */
  async getCategoryProducts(categoryId: string, page = 1) {
    try {
      return await serverFetch<any>(
        `/products?category=${categoryId}&page=${page}&limit=20`,
        { revalidate: 60 }
      );
    } catch {
      return { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    }
  },

  /**
   * Search
   */
  async searchProducts(query: string, filters: Record<string, string> = {}) {
    try {
      const params = new URLSearchParams({ search: query, ...filters });
      return await serverFetch<any>(`/products?${params}`, { revalidate: 30 });
    } catch {
      return { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    }
  },

  /**
   * Hamma kategoriyalar
   */
  async getCategories() {
    try {
      const data = await serverFetch<any>('/categories', { revalidate: 600 });
      return data?.categories || [];
    } catch {
      return [];
    }
  },
};
