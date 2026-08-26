'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { productApi } from '../services/marketplaceApi';
import { Category, ProductGrade } from '../types';
import { ProductCard } from './product/ProductCard';
import { ProductCardSkeleton, EmptyState } from './ui';
import { useT } from '../hooks/useT';
import { getML } from '../utils/format';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';
import { GRADES } from '../lib/grades';

interface SearchContentProps {
  initialParams: {
    q?: string;
    category?: string;
    grade?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
  };
  categories: Category[];
}

export function SearchContent({ initialParams, categories }: SearchContentProps) {
  const { t, lang } = useT();
  const router = useRouter();

  const [query, setQuery] = useState(initialParams.q || '');
  const [category, setCategory] = useState(initialParams.category || '');
  const [grade, setGrade] = useState<ProductGrade | ''>(
    (initialParams.grade as ProductGrade) || ''
  );
  const [sort, setSort] = useState(initialParams.sort || 'newest');
  const [minPrice, setMinPrice] = useState(initialParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { query, category, grade, sort, minPrice, maxPrice, page, featured: initialParams.featured }],
    queryFn: () =>
      productApi.getProducts({
        search: query || undefined,
        category: category || undefined,
        grade: grade || undefined,
        sort,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        featured: initialParams.featured === 'true' ? true : undefined,
        page,
        limit: 24,
      }),
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const resetFilters = () => {
    setCategory('');
    setGrade('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = category || grade || minPrice || maxPrice;

  return (
    <div className="container-page py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-6">
          {query ? `"${query}"` : t('search.results')}
        </h1>

        {/* Search bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t('search.placeholder')}
            className="input pl-12 h-14 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-[#1F1F28]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters - Sidebar */}
        <aside
          className={cn(
            'lg:block',
            filtersOpen
              ? 'fixed inset-0 z-30 bg-white dark:bg-[#0A0A0F] p-6 overflow-y-auto'
              : 'hidden'
          )}
        >
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('search.filters')}</h3>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600"
                  >
                    {t('search.reset')}
                  </button>
                )}
                <button
                  className="lg:hidden p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#1F1F28]"
                  onClick={() => setFiltersOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grade filter */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-3">
                {t('grades.title')}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setGrade('');
                    setPage(1);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-bold border transition-colors',
                    grade === ''
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-[#13131A] border-zinc-200 dark:border-zinc-800 text-ink dark:text-ink-dark hover:border-brand-500'
                  )}
                >
                  {t('common.seeAll')}
                </button>
                {GRADES.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => {
                      setGrade((v) => (v === g.key ? '' : g.key));
                      setPage(1);
                    }}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1',
                      grade === g.key
                        ? 'text-white'
                        : 'bg-white dark:bg-[#13131A] border-zinc-200 dark:border-zinc-800 text-ink dark:text-ink-dark hover:opacity-80'
                    )}
                    style={
                      grade === g.key
                        ? { backgroundColor: g.color, borderColor: g.color }
                        : undefined
                    }
                  >
                    <span>{g.emoji}</span>
                    {g.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-3">
                Kategoriya
              </h4>
              <div className="space-y-1">
                <FilterRadio
                  checked={category === ''}
                  label="Hammasi"
                  onChange={() => {
                    setCategory('');
                    setPage(1);
                  }}
                />
                {categories.map((cat) => (
                  <FilterRadio
                    key={cat._id}
                    checked={category === cat._id}
                    label={`${cat.icon || ''} ${getML(cat.name, lang)}`.trim()}
                    onChange={() => {
                      setCategory(cat._id);
                      setPage(1);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-3">
                {t('search.priceRange')}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={t('search.minPrice')}
                  className="input h-10 text-sm"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={t('search.maxPrice')}
                  className="input h-10 text-sm"
                />
              </div>
            </div>

            {/* Apply button (mobile) */}
            <Button
              fullWidth
              size="lg"
              className="lg:hidden"
              onClick={() => setFiltersOpen(false)}
            >
              {t('search.apply')}
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
              {pagination ? `${pagination.total} ta` : '...'}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden btn-secondary btn-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t('search.filters')}
              </button>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="input h-9 w-auto text-sm pr-8"
              >
                <option value="newest">{t('search.sortNewest')}</option>
                <option value="price_asc">{t('search.sortPriceAsc')}</option>
                <option value="price_desc">{t('search.sortPriceDesc')}</option>
                <option value="popular">{t('search.sortPopular')}</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title={t('search.noResults')}
              description="Boshqa kalit so'z yoki filtrlar bilan urinib ko'ring"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={page === 1}
                  >
                    Oldingi
                  </Button>
                  <span className="px-4 text-sm font-medium">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={page >= pagination.totalPages}
                  >
                    Keyingi
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterRadio({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        checked
          ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400'
          : 'hover:bg-zinc-100 dark:hover:bg-[#1F1F28] text-ink-secondary dark:text-ink-dark-secondary'
      )}
    >
      <span>{label}</span>
      {checked && <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
    </button>
  );
}
