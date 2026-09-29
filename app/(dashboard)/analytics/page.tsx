'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  Globe2, 
  TrendingUp, 
  Users, 
  Zap, 
  Download, 
  Layers,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const FunnelChart = dynamic(() => import('@/components/dashboard/funnel-chart').then(mod => mod.FunnelChart), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[360px] rounded-xl" />
});

const RetentionCohort = dynamic(() => import('@/components/dashboard/retention-cohort').then(mod => mod.RetentionCohort), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[360px] rounded-xl" />
});

const CountryMap = dynamic(() => import('@/components/dashboard/country-map').then(mod => mod.CountryMap), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[360px] rounded-xl" />
});

const ActivityHeatmap = dynamic(() => import('@/components/dashboard/activity-heatmap').then(mod => mod.ActivityHeatmap), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px] rounded-xl" />
});

const SystemAnalytics = dynamic(() => import('@/components/dashboard/system-analytics').then(mod => mod.SystemAnalytics), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px] rounded-xl" />
});

const SourcesChart = dynamic(() => import('@/components/dashboard/sources-chart').then(mod => mod.SourcesChart), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl" />
});

export default function AnalyticsPage() {
  const handleExport = () => {
    toast.success('Analytics report exported successfully!', {
      description: 'Your CSV data download has started.',
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Product & User Analytics" 
          description="Track conversion funnels, user retention, geographic footprint, and telemetry."
          action={
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-2 text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
            </div>
          }
        />

        {/* Top Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Active Users"
            value={128490}
            trend="up"
            trendValue="+18.4%"
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            title="Activation Rate"
            value={64.2}
            suffix="%"
            trend="up"
            trendValue="+5.1%"
            icon={<Zap className="w-4 h-4" />}
          />
          <StatCard
            title="Net Retention Rate"
            value={118.6}
            suffix="%"
            trend="up"
            trendValue="+2.3%"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            title="Avg. P95 API Latency"
            value={42}
            suffix="ms"
            trend="down"
            trendValue="-14.8%"
            icon={<Activity className="w-4 h-4" />}
          />
        </div>

        {/* Tabbed View */}
        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Funnel & Conversion
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex items-center gap-2">
              <Layers className="w-4 h-4" /> Cohorts & Retention
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> Regional & Traffic
            </TabsTrigger>
            <TabsTrigger value="telemetry" className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Telemetry & Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelChart />
              <SourcesChart />
            </div>
            <ActivityHeatmap />
          </TabsContent>

          <TabsContent value="retention" className="space-y-6">
            <RetentionCohort />
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <CountryMap />
          </TabsContent>

          <TabsContent value="telemetry" className="space-y-6">
            <SystemAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
