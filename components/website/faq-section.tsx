'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    question: 'How is data persisted in this deployment?',
    answer:
      'Strata connects directly to a local, zero-config SQLite database via Prisma ORM and the LibSQL client driver. All registered users, project tasks, and invoices are persistently saved to dev.db on your local disk.',
  },
  {
    question: 'Can this connect to cloud databases like Neon or Supabase?',
    answer:
      'Yes. Strata uses standard Prisma ORM. To switch to cloud PostgreSQL, simply update the DATABASE_URL environment variable in .env.local and run npx prisma db push.',
  },
  {
    question: 'How does Role-Based Access Control (RBAC) work?',
    answer:
      'The platform ships with a robust role-based permission store supporting Admin, Manager, Developer, and Viewer roles. Destructive operations (such as deleting projects or clearing invoices) and financial settings are automatically restricted based on role membership.',
  },
  {
    question: 'Can I export invoices and reports to PDF or CSV?',
    answer:
      'Yes. The invoice engine features built-in printable and downloadable PDF generation. Additionally, analytics data, team user tables, and revenue trends can be exported to CSV or JSON with a single click.',
  },
  {
    question: 'What frontend stack powers Strata?',
    answer:
      'Strata is built with Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, TanStack Table v8, and Recharts, optimized for sub-100ms client transitions.',
  },
];

export function WebsiteFAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-muted/20 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono text-muted-foreground border-border mb-3">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Key details about architecture, data persistence, and platform capabilities.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
