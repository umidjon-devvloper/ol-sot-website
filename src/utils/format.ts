export const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) return '0';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('998') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  return phone;
};

export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+998')) return cleaned;
  if (cleaned.startsWith('998')) return '+' + cleaned;
  if (cleaned.length === 9) return '+998' + cleaned;
  return cleaned;
};

/**
 * Multilingual matn olish
 */
export const getML = (
  text: { uz?: string; ru?: string; en?: string } | string | null | undefined,
  lang: 'uz' | 'ru' | 'en' = 'uz'
): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.uz || text.en || '';
};
