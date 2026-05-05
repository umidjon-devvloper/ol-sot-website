'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Product } from '../../types';
import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { favoriteApi } from '../../services/marketplaceApi';
import { formatPrice, getML } from '../../utils/format';
import { cn } from '../../lib/cn';

interface ProductCardProps {
  product: Product;
  onFavoriteToggle?: (productId: string, isFavorite: boolean) => void;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, onFavoriteToggle, variant = 'default' }: ProductCardProps) {
  const { lang, t } = useT();
  const user = useAuthStore((s) => s.user);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const title = getML(product.title, lang);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(t('auth.loginTitle'));
      return;
    }

    if (favLoading) return;
    setFavLoading(true);

    try {
      const result = await favoriteApi.toggleFavorite(product._id);
      setIsFavorite(result.isFavorite);
      onFavoriteToggle?.(product._id, result.isFavorite);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className="group card overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-zinc-100 dark:bg-[#1F1F28] overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-bold">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && !hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-brand-500 text-white text-xs font-bold tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          aria-label={isFavorite ? t('product.removeFavorite') : t('product.addFavorite')}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
            'bg-white/90 dark:bg-[#13131A]/90 backdrop-blur-sm',
            'hover:scale-110 active:scale-95',
            'shadow-sm'
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-ink-muted'
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        {product.brand && (
          <p className="text-[10px] font-bold tracking-wider text-ink-muted dark:text-ink-dark-muted uppercase">
            {product.brand}
          </p>
        )}

        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold tracking-tight">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
