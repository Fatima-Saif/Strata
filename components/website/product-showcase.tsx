'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Kanban, 
  UserCheck, 
  FileSpreadsheet, 
  ArrowUpRight, 
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tabs = [
  {
    id: 'analytics',
    label: 'Revenue Analytics',
    icon: BarChart3,
    title: 'Precision Metrics & Cohort Retention',
    description: 'Track Net MRR, Churn rate, Average Revenue Per User (ARPU), and customer lifetime value across custom billing cycles.',
    highlights: [
      'Interactive multi-metric chart overlays',
      'Cohort retention matrices and churn alerts',
      'Segmentation by customer tier and geography',
      'Instant CSV and JSON metrics export',
    ],
    path: '/analytics',
    stat: '+34.8% ARR Growth',
  },
  {
    id: 'kanban',
    label: 'Sprint Kanban',
    icon: Kanban,
    title: 'Fluid Task & Sprint Management',
    description: 'Coordinate engineering roadmaps with drag-and-drop state transitions, priority tags, assignee tracking, and automated velocity calculation.',
    highlights: [
      'Seamless drag and drop between sprint columns',
      'Task assignment, tags, and milestone deadlines',
      'Real-time sprint progress bar and completion rate',
      'Filter by assignee, milestone, or severity',
    ],
    path: '/projects',
    stat: '98.4% On-Time Delivery',
  },
  {
    id: 'rbac',
    label: 'Access Control',
    icon: UserCheck,
    title: 'Enterprise RBAC & Team Management',
    description: 'Fine-grained permissions matrix. Switch between Admin, Manager, Developer, and Viewer roles to evaluate security scoping.',
    highlights: [
      'Instant role switching simulation',
      'Granular read/write permissions per module',
      'Audit log tracking for every sensitive action',
      'One-click user invitation and deprovisioning',
    ],
    path: '/users',
    stat: '4 Roles Configured',
  },
  {
    id: 'invoicing',
    label: 'Invoicing & Reports',
    icon: FileSpreadsheet,
    title: 'Automated Billing & Financial Reporting',
    description: 'Generate branded PDF invoices, monitor paid/pending balances, and compile executive financial summaries.',
    highlights: [
      'Full PDF export and print styling',
      'Automated status updates: Paid, Pending, Overdue',
      'Multi-currency and sales tax calculation',
      'Executive financial reports with one-click export',
    ],
    path: '/invoices',
    stat: '100% Automated',
  },
];

export function WebsiteShowcase() {
  const [activeTabId, setActiveTabId] = React.useState('analytics');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <section id="showcase" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono text-muted-foreground border-border mb-3">
            Product Explorer
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Explore the Core Modules
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Experience the modular power of Strata directly in your browser.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-10 flex overflow-x-auto pb-2">
          <div className="inline-flex p-1 rounded-lg bg-muted/50 border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Preview Display */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-muted text-foreground border border-border">
                {activeTab.stat}
              </div>

              <h3 className="text-2xl font-bold text-foreground">
                {activeTab.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-sm">
                {activeTab.description}
              </p>

              <div className="space-y-2.5 pt-1">
                {activeTab.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link href={activeTab.path}>
                  <Button size="sm" className="gap-2">
                    Open {activeTab.label} in Workspace
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Mock Display Column */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-muted/20 p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="font-semibold text-foreground">Module: {activeTab.label}</span>
                </div>
                <span className="font-mono text-[11px]">Route: {activeTab.path}</span>
              </div>

              {/* Dynamic Content based on selected tab */}
              {activeTabId === 'analytics' && (
                <div className="mt-4 space-y-3.5">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-lg bg-background border border-border">
                      <div className="text-[11px] text-muted-foreground">Annual Run Rate</div>
                      <div className="text-base font-bold text-foreground font-mono mt-1">$1.54M</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">+24% YoY</div>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-border">
                      <div className="text-[11px] text-muted-foreground">Net Retention</div>
                      <div className="text-base font-bold text-foreground font-mono mt-1">118%</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Enterprise cohort</div>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-border">
                      <div className="text-[11px] text-muted-foreground">LTV / CAC</div>
                      <div className="text-base font-bold text-foreground font-mono mt-1">4.2x</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Healthy ratio</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-background border border-border">
                    <div className="flex justify-between items-center text-xs mb-3 font-semibold text-foreground">
                      <span>Cohort Retention Distribution</span>
                      <Badge variant="outline" className="text-[10px] font-mono">Monthly Active</Badge>
                    </div>
                    <div className="space-y-2">
                      {[
                        { cohort: 'Enterprise Plan', pct: 94, color: 'bg-indigo-600' },
                        { cohort: 'Growth Plan', pct: 86, color: 'bg-indigo-500' },
                        { cohort: 'Starter Tier', pct: 72, color: 'bg-indigo-400' },
                      ].map((c) => (
                        <div key={c.cohort} className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{c.cohort}</span>
                            <span className="font-semibold text-foreground font-mono">{c.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTabId === 'kanban' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground pb-1 border-b border-border">
                      <span>In Progress</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">3 tasks</span>
                    </div>
                    <div className="p-2.5 rounded-md border border-border bg-card text-xs space-y-1">
                      <div className="font-medium text-foreground">Auth Session Middleware</div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>P1 - Urgent</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">In Review</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-md border border-border bg-card text-xs space-y-1">
                      <div className="font-medium text-foreground">Stripe Tax 2.0 Webhook</div>
                      <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>P2 - Normal</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Writing tests</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground pb-1 border-b border-border">
                      <span>Completed</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">6 tasks</span>
                    </div>
                    <div className="p-2.5 rounded-md border border-border bg-card text-xs space-y-1 opacity-90">
                      <div className="font-medium text-foreground line-through text-muted-foreground">Cmd+K Command Dialog</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Shipped</div>
                    </div>
                    <div className="p-2.5 rounded-md border border-border bg-card text-xs space-y-1 opacity-90">
                      <div className="font-medium text-foreground line-through text-muted-foreground">Role Permissions Matrix</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTabId === 'rbac' && (
                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs font-mono">
                          AD
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">Admin Role</div>
                          <div className="text-[11px] text-muted-foreground">Full destructive and financial permissions</div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[10px]">Unrestricted</Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-muted text-muted-foreground font-bold flex items-center justify-center text-xs font-mono">
                          MG
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">Manager Role</div>
                          <div className="text-[11px] text-muted-foreground">Sprint management, reports, user invites</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Scoped</Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-muted text-muted-foreground font-bold flex items-center justify-center text-xs font-mono">
                          VW
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">Viewer Role</div>
                          <div className="text-[11px] text-muted-foreground">Read-only analytics and dashboards</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">Read Only</Badge>
                    </div>
                  </div>
                </div>
              )}

              {activeTabId === 'invoicing' && (
                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground font-mono">INV-2026-001</div>
                      <div className="text-[11px] text-muted-foreground">Enterprise Platform License (Annual)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground font-mono">$14,200.00</div>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Paid • PDF Ready</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground font-mono">INV-2026-002</div>
                      <div className="text-[11px] text-muted-foreground">Integration & Custom SLA Tier</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground font-mono">$8,750.00</div>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Paid</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
