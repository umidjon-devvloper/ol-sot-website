import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '../components/Providers';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/layout/BottomNav';
import { CartHost } from '../components/cart/CartHost';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Marketplace - Telefonlar va aksessuarlar',
    template: '%s | Marketplace',
  },
  description:
    'O\'zbekistondagi #1 marketplace - telefonlar va aksessuarlar. Yangi va asl mahsulotlar, qulay narxlar, tezkor yetkazib berish.',
  keywords: ['telefon', 'iphone', 'samsung', 'aksessuar', 'marketplace', 'uzbekistan', 'tashkent'],
  authors: [{ name: 'Marketplace' }],
  openGraph: {
    title: 'Marketplace',
    description: 'Telefonlar va aksessuarlar marketplace\'i',
    type: 'website',
    locale: 'uz_UZ',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <CartHost />
          </div>
        </Providers>
      </body>
    </html>
  );
}
