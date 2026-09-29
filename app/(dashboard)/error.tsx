'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-[500px]">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
      </div>
      <div className="flex space-x-4 mt-6">
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
