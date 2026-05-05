import { serverApi } from '../../services/apiServer';
import { SearchContent } from '../../components/SearchContent';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q;
  return {
    title: q ? `${q} - Qidiruv` : 'Mahsulotlar',
    description: q ? `${q} bo'yicha qidiruv natijalari` : 'Barcha mahsulotlar',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const categories = await serverApi.getCategories();

  return <SearchContent initialParams={params} categories={categories} />;
}

export const revalidate = 0;
