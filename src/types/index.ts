export type Language = "uz" | "ru" | "en";

export type ProductGrade = "s_plus" | "s1" | "cpo" | "as_is";

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
  role: "user" | "admin" | "super_admin";
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
  phone: string;
  telegram?: string;
}

export interface ProductImage {
  url: string;
}

export interface Product {
  _id: string;
  title: string | Record<string, string>; // multilang
  description?: string | Record<string, string>; // multilang
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  images: ProductImage[];
  brand?: string;
  condition: "new" | "used" | "refurbished";
  grade?: ProductGrade;
  inStock: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  favoritesCount: number;
  specifications?: Map<string, string> | Record<string, string>;
  sellerContact?: SellerContact;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AIMessage {
  role: "user" | "assistant";
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

// ============================================================
// Optom (Dubaydan ulgurji)
// ============================================================
export interface WholesaleOffer {
  condition: string;
  variant: string;
  priceUSD: number;
  extraUSD?: number;
}

export interface WholesaleProduct {
  _id: string;
  name: string;
  brand: string;
  note: string;
  priceUSD: number | null;
  offers: WholesaleOffer[];
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface WholesaleSettings {
  customsPercent: number;
  imeiUSD: number;
  cargoUSD: number;
  usdToUzs: number;
  minOrderQty: number;
}
