'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WebsiteCTA() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-900/90 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-md">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to streamline your software operations?
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Explore the live interactive dashboard or register a new workspace account in seconds.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/dashboard">
                <Button 
                  size="default" 
                  className="bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2 shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  Launch Workspace Demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button 
                  size="default" 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs font-medium"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
