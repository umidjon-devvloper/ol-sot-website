import { serverApi } from '../services/apiServer';
import { HomeContent } from '../components/HomeContent';

/**
 * Home page - Server Component
 *
 * Mahsulotlar va kategoriyalarni server tomonida oladi (SEO + tezkor yuklanish).
 * HomeContent client komponent - interaktiv elementlar uchun.
 */
export default async function HomePage() {
  const data = await serverApi.getHomeData();

  return <HomeContent {...data} />;
}

// ISR - har 60 soniyada qayta generatsiya
export const revalidate = 60;
