'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

const testimonials = [
  {
    quote: "Strata brought our billing turnaround from 3 days down to automated seconds. The cohort analysis and RBAC isolation are exceptionally well executed.",
    author: "Elena Rostova",
    role: "VP of Product",
    company: "HyperScale Cloud",
    avatar: "ER",
  },
  {
    quote: "The keyboard navigation and command palette make our engineering leads significantly faster when triaging sprint issues and monitoring live API health.",
    author: "Marcus Chen",
    role: "Chief Technology Officer",
    company: "Nexis Financial",
    avatar: "MC",
  },
  {
    quote: "We evaluated multiple platforms. Strata stood out for responsiveness, clean state management, and how reliably it handles invoice exports.",
    author: "Sarah Jenkins",
    role: "Head of Operations",
    company: "Vanguard Tech",
    avatar: "SJ",
  },
];

export function WebsiteTestimonials() {
  return (
    <section id="testimonials" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono text-muted-foreground border-border mb-3">
            Customer Feedback
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Built for Modern Software Teams
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Trusted by engineering, product, and finance leaders.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-border bg-card shadow-2xs hover:border-indigo-500/30 transition-all duration-150 flex flex-col justify-between"
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                "{t.quote}"
              </p>

              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold flex items-center justify-center text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-xs text-foreground">{t.author}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {t.role}, <span className="font-medium text-foreground">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
