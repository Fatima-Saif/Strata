'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Terminal, 
  ShieldCheck, 
  CreditCard, 
  Search, 
  ExternalLink, 
  HelpCircle, 
  LifeBuoy, 
  FileCode, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const docCategories = [
  {
    title: 'Platform Architecture',
    description: 'Learn how Strata handles high-concurrency event telemetry, SQLite/LibSQL drivers, and Next.js 16.',
    icon: BookOpen,
    href: '/docs/architecture',
    articles: ['Overview of Strata Core', 'Database persistence with Prisma 7', 'LibSQL driver adapter configuration'],
  },
  {
    title: 'API & Webhooks Integration',
    description: 'Integrate real-time HTTP webhooks, generate bearer tokens, and automate billing reconciliation.',
    icon: Terminal,
    href: '/api',
    articles: ['REST API authentication', 'Webhook signature verification', 'Pagination & rate-limiting guides'],
  },
  {
    title: 'Security, Auth & RBAC',
    description: 'Configure SAML 2.0 Single Sign-On, custom RBAC permissions, and SOC2 audit log streams.',
    icon: ShieldCheck,
    href: '/settings',
    articles: ['Role-based access matrix', 'Enforcing mandatory MFA', 'Session token rotation policies'],
  },
  {
    title: 'Billing & Invoicing Engine',
    description: 'Understand sequential invoice numbering, Stripe webhook syncing, and automated VAT deduction.',
    icon: CreditCard,
    href: '/invoices',
    articles: ['Sequential invoice generation', 'Handling overdue customer dunning', 'Custom billing metadata'],
  },
];

const faqs = [
  {
    q: 'How does Strata handle database persistence locally vs in production?',
    a: 'Strata uses Prisma ORM with the LibSQL driver adapter. In local development, all your projects, users, tasks, and invoices are saved directly to dev.db with zero cloud dependencies. In production, updating DATABASE_URL in .env.local connects directly to Turso, Neon, or Supabase PostgreSQL.',
  },
  {
    q: 'How do I add team members and assign roles?',
    a: 'Navigate to Team Management in the sidebar. As an Admin, you can invite new members via email and configure granular permissions across Admin, Manager, Developer, and Viewer roles.',
  },
  {
    q: 'Can I export all analytics and accounting data to CSV?',
    a: 'Yes. Every dashboard section (Analytics, Revenue, Customers, Invoices, and Reports) includes an Export CSV button that instantly downloads raw datasets.',
  },
  {
    q: 'How do I create and customize invoices?',
    a: 'Visit the Invoices tab. You can click Create Invoice to generate sequential invoices, add line items with automatic tax calculation, and mark payment statuses in real-time.',
  },
];

export default function HelpPage() {
  const [search, setSearch] = React.useState('');
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleSupportTicket = () => {
    toast.success('Support ticket created!', {
      description: 'The FalconFace Engineering team has received your inquiry.',
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-6xl mx-auto">
        <PageHeader 
          title="Help & Documentation" 
          description="Architecture guides, API references, troubleshooting, and direct FalconFace technical support."
        />

        {/* Hero Search Box */}
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white border border-border shadow-md">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-white/10 text-white border-white/20">
              FalconFace Knowledge Base
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              How can we help you today?
            </h2>
            <p className="text-white/70 text-sm">
              Search across our documentation, API reference guides, and engineering best practices.
            </p>
            <div className="relative max-w-lg pt-2">
              <Search className="absolute left-3.5 top-5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search articles, guides, API endpoints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:bg-white/15 focus-visible:border-white"
              />
            </div>
          </div>
        </div>

        {/* Doc Category Cards */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">Documentation Categories</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {docCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Card key={idx} className="hover:border-indigo-500/40 transition-colors shadow-xs">
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-1">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{cat.title}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed mt-1">
                        {cat.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-1.5 border-t border-border/50 pt-3">
                      {cat.articles.map((art, aIdx) => (
                        <li key={aIdx}>
                          <Link 
                            href={cat.href}
                            className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center justify-between group"
                          >
                            <span>{art}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">Frequently Asked Questions</h3>
          <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-xs">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-medium text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-muted-foreground font-mono text-base ml-2">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Direct Support Card */}
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-base flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-indigo-600" />
              Need Dedicated Engineering Assistance?
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl">
              FalconFace enterprise support is available 24/7 with a guaranteed 15-minute response SLA for production incidents.
            </p>
          </div>
          <Button 
            onClick={handleSupportTicket}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Contact FalconFace Support
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
