'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Phone, Check, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Product } from '../types';
import { useT } from '../hooks/useT';
import { useAuthStore } from '../store/authStore';
import { favoriteApi } from '../services/marketplaceApi';
import { formatPrice, getML } from '../utils/format';
import { ProductCard } from './product/ProductCard';
import { Button } from './ui/Button';
import { Badge } from './ui';
import { cn } from '../lib/cn';

interface ProductDetailProps {
  product: Product;
  similar: Product[];
}

export function ProductDetail({ product, similar }: ProductDetailProps) {
  const { t, lang } = useT();
  const user = useAuthStore((s) => s.user);

  const [imageIndex, setImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const images = product.images?.length > 0 ? product.images : [{ url: product.thumbnail || '' }];
  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const title = getML(product.title, lang);
  const description = getML(product.description, lang);

  const conditionLabels: Record<string, string> = {
    new: t('product.new'),
    used: t('product.used'),
    refurbished: t('product.refurbished'),
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error(t('auth.loginTitle'));
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const result = await favoriteApi.toggleFavorite(product._id);
      setIsFavorite(result.isFavorite);
      toast.success(
        result.isFavorite ? t('product.addFavorite') : t('product.removeFavorite')
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link nusxalandi');
    }
  };

  const specs = product.specifications
    ? Array.from(
        product.specifications instanceof Map
          ? product.specifications.entries()
          : Object.entries(product.specifications)
      )
    : [];

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-[#1F1F28] group">
            <Image
              src={images[imageIndex]?.url || ''}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <Badge variant="danger" className="text-sm px-3 py-1">
                  -{discountPercent}%
                </Badge>
              )}
              {product.isNew && !hasDiscount && (
                <Badge variant="brand" className="text-sm px-3 py-1">
                  NEW
                </Badge>
              )}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-[#13131A]/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-[#13131A]/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    'aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#1F1F28] border-2 transition-all',
                    i === imageIndex
                      ? 'border-brand-500 scale-95'
                      : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
                  )}
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Brand & condition */}
          <div className="flex items-center gap-3 mb-3">
            {product.brand && (
              <span className="text-xs font-black tracking-widest text-brand-500 uppercase">
                {product.brand}
              </span>
            )}
            <Badge variant="success">{conditionLabels[product.condition]}</Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-4">
            {title}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-ink-muted dark:text-ink-dark-muted mb-6">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {product.favoritesCount}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl lg:text-5xl font-black tracking-tight">
                {formatPrice(finalPrice)}
              </span>
              <span className="text-lg text-ink-secondary font-medium">
                {t('common.sum')}
              </span>
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-base text-ink-muted line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="danger" className="text-xs">
                  -{discountPercent}%
                </Badge>
              </div>
            )}
          </div>

          {/* Stock */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg mb-8',
              product.inStock
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-bold">
              {product.inStock ? t('product.inStock') : t('product.outOfStock')}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3 mb-10">
            {product.sellerContact ? (
              <>
                <a
                  href={`tel:${product.sellerContact.phone}`}
                  className="btn-primary btn-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">{product.sellerContact.phone}</span>
                </a>
                {product.sellerContact.telegram && (
                  <a
                    href={`https://t.me/${product.sellerContact.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lg flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 bg-[#0088cc] hover:bg-[#0077b3] text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold">{product.sellerContact.telegram}</span>
                  </a>
                )}
              </>
            ) : (
              <Button size="lg" fullWidth icon={<Phone className="w-4 h-4" />}>
                {t('product.contact')}
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleFavorite}
                loading={favLoading}
                aria-label={t('product.addFavorite')}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isFavorite && 'fill-red-500 text-red-500'
                  )}
                />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleShare}
                aria-label={t('product.share')}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3">{t('product.description')}</h2>
              <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {specs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">{t('product.specifications')}</h2>
              <div className="card overflow-hidden">
                {specs.map(([key, value], i) => (
                  <div
                    key={String(key)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3',
                      i < specs.length - 1 && 'border-b border-zinc-200 dark:border-zinc-800'
                    )}
                  >
                    <span className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                      {String(key)}
                    </span>
                    <span className="text-sm font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight mb-6">
            {t('product.similar')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
            {similar.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
