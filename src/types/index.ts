export type Language = 'uz' | 'ru' | 'en';

export interface MultiLangText {
  uz: string;
  ru: string;
  en: string;
}

export interface User {
  _id: string;
  phone: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin' | 'super_admin';
  language: Language;
  notificationSettings: {
    newProducts: boolean;
    promotions: boolean;
    adminMessages: boolean;
  };
  isActive: boolean;
  isBlocked: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: MultiLangText;
  slug: string;
  description: MultiLangText;
  icon: string;
  image: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  productCount: number;
}

export interface ProductImage {
  url: string;
  key?: string;
  order: number;
}

export interface SellerContact {
  _id: string;
  name: string;
  phone: string;
  telegram: string;
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: MultiLangText;
  description: MultiLangText;
  slug: string;
  category: Category | string;
  brand: string;
  price: number;
  discountPrice: number | null;
  currency: 'UZS' | 'USD';
  images: ProductImage[];
  thumbnail: string;
  condition: 'new' | 'used' | 'refurbished';
  specifications: Record<string, string>;
  sellerContact: SellerContact | string | null;
  inStock: boolean;
  quantity: number;
  tags: string[];
  favoritesCount: number;
  status: 'active' | 'inactive' | 'draft' | 'sold';
  isFeatured: boolean;
  isNew: boolean;
  isFavorite?: boolean;
  discountPercent?: number;
  finalPrice?: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  recommendedProducts?: Product[];
  timestamp?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
