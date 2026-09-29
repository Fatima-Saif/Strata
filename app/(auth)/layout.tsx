import * as React from 'react';
import Link from 'next/link';
import { StrataLogo } from '@/components/ui/brand-logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <StrataLogo />
        </Link>
      </div>
      {children}
      <p className="mt-8 text-xs text-muted-foreground">
        Powered by{' '}
        <a
          href="https://falconface.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground hover:underline hover:text-primary transition-colors"
        >
          FalconFace
        </a>
      </p>
    </div>
  );
}
