'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  LayoutDashboard, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Activity,
  DollarSign,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function WebsiteHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-primary/10 to-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Product Announcement */}
        <div className="flex justify-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-muted/80 border border-border text-foreground hover:bg-muted transition-colors shadow-xs group"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="font-semibold text-primary">Strata 2.4</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Interactive Command Workspace</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Hero Title & Subheading */}
        <div className="mt-7 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            The Operating System for Modern{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Software Operations
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Strata unifies financial analytics, sprint velocity tracking, automated invoicing, and role governance into a single, high-performance platform engineered for speed.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm h-11 px-7 gap-2 shadow-xs">
                <LayoutDashboard className="w-4 h-4" />
                Open Live Dashboard
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>

            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm h-11 px-6">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Instant local SQLite persistence
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Granular RBAC permissions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> SOC-2 Type II standards
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Mockup Card */}
        <div className="mt-12 relative">
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline">
                  app.strata.internal/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync
                </span>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 px-2">
                    Open Full View
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dashboard Content Preview */}
            <div className="p-4 sm:p-6 lg:p-7 space-y-5 bg-background">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-lg border border-border bg-card/60 shadow-2xs hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                    <span>Monthly Recurring Revenue</span>
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-foreground font-mono">$128,430</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    +18.2% vs last month
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/60 shadow-2xs hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                    <span>Active Team Seats</span>
                    <Users className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-foreground font-mono">24,592</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    +12.4% new accounts
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/60 shadow-2xs hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                    <span>API Queries</span>
                    <Activity className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-foreground font-mono">14.8M</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    38ms avg latency
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/60 shadow-2xs hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                    <span>Sprint Delivery</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-foreground font-mono">98.6%</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    On-time milestones
                  </div>
                </div>
              </div>

              {/* Chart & Sprint Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                <div className="lg:col-span-2 p-5 rounded-lg border border-border bg-card/60 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Revenue Trajectory</h4>
                      <p className="text-xs text-muted-foreground">Monthly run rate performance across active accounts</p>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono">YTD 2026</Badge>
                  </div>
                  {/* Chart Bars */}
                  <div className="h-40 w-full flex items-end justify-between gap-2 pt-4 px-1">
                    {[
                      { m: 'Jan', h: '45%' },
                      { m: 'Feb', h: '55%' },
                      { m: 'Mar', h: '50%' },
                      { m: 'Apr', h: '70%' },
                      { m: 'May', h: '65%' },
                      { m: 'Jun', h: '82%' },
                      { m: 'Jul', h: '78%' },
                      { m: 'Aug', h: '92%' },
                      { m: 'Sep', h: '100%' },
                    ].map((bar) => (
                      <div key={bar.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div 
                          className="w-full rounded-xs bg-indigo-600 group-hover:bg-indigo-500 transition-colors duration-150"
                          style={{ height: bar.h }}
                        />
                        <span className="text-[11px] font-mono text-muted-foreground">{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Sprint Status */}
                <div className="p-5 rounded-lg border border-border bg-card/60 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Sprint Velocity</h4>
                    <p className="text-xs text-muted-foreground">Sprint 34 delivery metrics</p>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Core Engine v2</span>
                          <span className="font-medium text-foreground font-mono">92%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-1.5 rounded-full w-[92%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Stripe Billing Webhooks</span>
                          <span className="font-medium text-foreground font-mono">100%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">RBAC Audit Stream</span>
                          <span className="font-medium text-foreground font-mono">74%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-400 h-1.5 rounded-full w-[74%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/projects" className="mt-4">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Project Kanban Board
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-y border-border py-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">$48.5M+</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Managed Volume</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">99.99%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Uptime SLA</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">12,000+</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Active Workspaces</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">&lt; 40ms</div>
            <div className="mt-0.5 text-xs text-muted-foreground">p99 Query Latency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
