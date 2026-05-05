import { redirect } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Category page - search sahifasiga redirect
 * Search sahifasida filter sifatida ishlatiladi
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  redirect(`/search?category=${id}`);
}
