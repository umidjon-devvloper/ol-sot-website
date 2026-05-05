/**
 * Ilova konfiguratsiyasi
 */
export const Config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Marketplace',

  STORAGE: {
    TOKEN: 'auth_token',
    LANGUAGE: 'app_language',
    THEME: 'app_theme',
  },

  PAGE_SIZE: 20,
  IMAGE_PLACEHOLDER: 'https://via.placeholder.com/400x400/1C1C24/FFFFFF?text=No+Image',
  DEFAULT_CURRENCY: 'UZS',
};
