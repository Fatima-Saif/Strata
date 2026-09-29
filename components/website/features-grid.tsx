'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ShieldCheck, 
  Kanban, 
  Terminal, 
  FileText, 
  Bell, 
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: BarChart3,
    title: 'Financial & Cohort Analytics',
    description: 'Time-series visualization for Net MRR, retention cohorts, expansion velocity, and customer lifetime value metrics.',
    tag: 'Analytics',
    href: '/analytics',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Governance',
    description: 'Fine-grained policy enforcement across Admin, Manager, Developer, and Viewer roles with persistent audit logging.',
    tag: 'Security',
    href: '/users',
  },
  {
    icon: Kanban,
    title: 'Sprint & Kanban Workflows',
    description: 'Task orchestration with drag-and-drop state transitions, milestone deadlines, assignee tracking, and automated velocity calculation.',
    tag: 'Execution',
    href: '/projects',
  },
  {
    icon: Terminal,
    title: 'Linear-Style Command Palette',
    description: 'Fuzzy navigation via Cmd+K shortcuts across customers, projects, invoices, and system settings without leaving the keyboard.',
    tag: 'Keyboard',
    href: '/dashboard',
  },
  {
    icon: FileText,
    title: 'Automated Invoice Generation',
    description: 'Structured billing with multi-currency calculations, automated status tracking (Paid, Pending, Overdue), and PDF exports.',
    tag: 'Billing',
    href: '/invoices',
  },
  {
    icon: Bell,
    title: 'Event & Notification Stream',
    description: 'Persistent alert dispatching for billing milestones, team activity, and security changes across your workspace.',
    tag: 'Events',
    href: '/notifications',
  },
];

export function WebsiteFeatures() {
  return (
    <section id="features" className="py-20 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono text-muted-foreground border-border mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Engineered for High-Velocity Teams
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Every module in Strata is architected for instant reactivity, keyboard navigation, and reliable data persistence.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:border-indigo-500/40 hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Open in Workspace
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
