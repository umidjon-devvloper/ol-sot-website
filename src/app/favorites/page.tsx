'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import Link from 'next/link';

import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { favoriteApi } from '../../services/marketplaceApi';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCardSkeleton, EmptyState } from '../../components/ui';

export default function FavoritesPage() {
  const { t } = useT();
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/login');
    }
  }, [user, isInitialized, router]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteApi.getFavorites(1, 50),
    enabled: !!user,
  });

  if (!user) return null;

  const products = data?.products || [];

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          {t('favorites.title')}
        </h1>
        {data?.pagination && (
          <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary mt-1">
            {data.pagination.total} ta mahsulot
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title={t('favorites.empty')}
          description={t('favorites.emptyDesc')}
          action={
            <Link href="/search" className="btn-primary btn-md">
              {t('favorites.explore')}
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{ ...product, isFavorite: true }}
              onFavoriteToggle={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
