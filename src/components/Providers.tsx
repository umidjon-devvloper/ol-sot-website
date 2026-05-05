'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 daqiqa
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const initAuth = useAuthStore((s) => s.initialize);
  const initUI = useUIStore((s) => s.initialize);

  useEffect(() => {
    initUI();
    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          className: '!bg-white !text-ink dark:!bg-[#1C1C24] dark:!text-ink-dark !border !border-zinc-200 dark:!border-zinc-800 !rounded-xl !text-sm !font-medium',
          style: {
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
          },
        }}
      />
    </QueryClientProvider>
  );
}
