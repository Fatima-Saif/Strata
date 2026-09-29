'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { SessionMonitor } from '@/components/auth/session-monitor';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <SessionMonitor />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
