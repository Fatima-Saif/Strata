'use client';

import * as React from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    // Basic mock implementation. In a real app this would trigger a context/state.
    console.log('Toast:', props);
  }, []);

  return { toast };
}
