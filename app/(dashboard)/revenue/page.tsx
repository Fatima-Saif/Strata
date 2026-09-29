'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  FileText, 
  Download,
  PieChart,
  Repeat
} from 'lucide-react';
import { toast } from 'sonner';

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart').then(mod => mod.RevenueChart), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />
});

const RevenueSummaryReports = dynamic(() => import('@/components/reports/revenue-summary-reports').then(mod => mod.RevenueSummaryReports), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />
});

const ExpenseBreakdown = dynamic(() => import('@/components/reports/expense-breakdown').then(mod => mod.ExpenseBreakdown), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl" />
});

const TaxSummaryCard = dynamic(() => import('@/components/reports/tax-summary-card').then(mod => mod.TaxSummaryCard), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl" />
});

const RevenueForecast = dynamic(() => import('@/components/reports/revenue-forecast').then(mod => mod.RevenueForecast), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl" />
});

export default function RevenuePage() {
  const handleExport = () => {
    toast.success('Financial ledger exported successfully!', {
      description: 'Your tax and revenue spreadsheet has been generated.',
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Revenue & Cashflow" 
          description="Track recurring subscription ARR, net retention, gross margins, and tax deductions."
          action={
            <div className="flex items-center gap-2">
              <Link href="/invoices">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium cursor-pointer">
                  <FileText className="w-3.5 h-3.5" />
                  View Invoices
                </Button>
              </Link>
              <Button 
                size="sm" 
                onClick={handleExport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-medium shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger
              </Button>
            </div>
          }
        />

        {/* Financial Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Recurring Revenue"
            value={348250}
            prefix="$"
            trend="up"
            trendValue="+14.2%"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <StatCard
            title="Annual Run Rate (ARR)"
            value={4.18}
            prefix="$"
            suffix="M"
            trend="up"
            trendValue="+22.6%"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            title="Gross Margin"
            value={82.4}
            suffix="%"
            trend="up"
            trendValue="+3.1%"
            icon={<PieChart className="w-4 h-4" />}
          />
          <StatCard
            title="Logo Churn Rate"
            value={0.74}
            suffix="%"
            trend="down"
            trendValue="-0.3%"
            icon={<Repeat className="w-4 h-4" />}
          />
        </div>

        {/* Tabbed Revenue Sections */}
        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trajectory & Growth
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Periodic Summary
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" /> AI Forecast & Pipeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-6">
            <RevenueChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseBreakdown />
              <TaxSummaryCard />
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <RevenueSummaryReports />
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <RevenueForecast />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
