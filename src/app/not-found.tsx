import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page py-20 lg:py-32">
      <div className="max-w-md mx-auto text-center">
        <div className="text-9xl font-black text-brand-500 mb-4">404</div>
        <h1 className="text-3xl font-black tracking-tight mb-3">Sahifa topilmadi</h1>
        <p className="text-ink-secondary dark:text-ink-dark-secondary mb-8">
          Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan
        </p>
        <Link href="/" className="btn-primary btn-lg inline-flex">
          <Home className="w-4 h-4" />
          Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
