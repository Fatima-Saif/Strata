'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardFilter } from '@/components/dashboard/dashboard-filter';
import { fetchDashboardData } from '@/lib/api/dashboard';
import { useDashboardFilter } from '@/store/use-dashboard-filter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { staggerContainer, slideUp } from '@/lib/motion';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RevenueChart = dynamic(() => import('@/components/dashboard/revenue-chart').then(mod => mod.RevenueChart), { 
  ssr: false, 
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" /> 
});
const SubscriptionChart = dynamic(() => import('@/components/dashboard/subscription-chart').then(mod => mod.SubscriptionChart), { 
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl lg:col-span-2" /> 
});
const SourcesChart = dynamic(() => import('@/components/dashboard/sources-chart').then(mod => mod.SourcesChart), { 
  ssr: false,
  loading: () => <Skeleton className="w-full h-[350px] rounded-xl lg:col-span-2" /> 
});
const GrowthComparison = dynamic(() => import('@/components/dashboard/growth-comparison').then(mod => mod.GrowthComparison), { ssr: false });
const RetentionCohort = dynamic(() => import('@/components/dashboard/retention-cohort').then(mod => mod.RetentionCohort), { ssr: false });
const ActivityHeatmap = dynamic(() => import('@/components/dashboard/activity-heatmap').then(mod => mod.ActivityHeatmap), { ssr: false });
const CountryMap = dynamic(() => import('@/components/dashboard/country-map').then(mod => mod.CountryMap), { ssr: false });
const FunnelChart = dynamic(() => import('@/components/dashboard/funnel-chart').then(mod => mod.FunnelChart), { ssr: false });
const SystemAnalytics = dynamic(() => import('@/components/dashboard/system-analytics').then(mod => mod.SystemAnalytics), { ssr: false });
const RecentActivity = dynamic(() => import('@/components/dashboard/recent-activity').then(mod => mod.RecentActivity), { ssr: false });
import { Banknote, Users, Activity, LogOut, RefreshCcw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardHomePage() {
  const { dateRange, comparePrevious } = useDashboardFilter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', dateRange, comparePrevious],
    queryFn: () => fetchDashboardData(dateRange, comparePrevious),
    staleTime: 60 * 1000,
  });

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Dashboard" 
          description="Overview of your primary metrics and active customers."
        />
        
        <DashboardFilter />

        {isError && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <RefreshCcw className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Failed to load data</h3>
                <p className="text-sm text-muted-foreground">The mock API simulated a failure. Please try again.</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Retry Connection
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Since mock data never returns totally empty if success, we'll just handle data if it exists */}
        {!isError && (
          <div className="space-y-4">
            {/* Primary KPI Grid */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={slideUp}>
                <StatCard
                  title="Total Revenue"
                  value={data?.primary.revenue.value || 0}
                  prefix={data?.primary.revenue.prefix}
                  suffix={data?.primary.revenue.suffix}
                  trend={data?.primary.revenue.trend}
                  trendValue={data?.primary.revenue.trendValue}
                  sparklineData={data?.primary.revenue.sparklineData}
                  icon={<Banknote className="h-4 w-4" />}
                  isLoading={isLoading}
                  gradient
                />
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title="Active Users"
                  value={data?.primary.activeUsers.value || 0}
                  prefix={data?.primary.activeUsers.prefix}
                  suffix={data?.primary.activeUsers.suffix}
                  trend={data?.primary.activeUsers.trend}
                  trendValue={data?.primary.activeUsers.trendValue}
                  sparklineData={data?.primary.activeUsers.sparklineData}
                  icon={<Users className="h-4 w-4" />}
                  isLoading={isLoading}
                >
                  {!isLoading && (
                    <div className="flex -space-x-2 mt-4 pt-4 border-t">
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                        <AvatarFallback>A1</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                        <AvatarFallback>A2</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarImage src="https://i.pravatar.cc/150?u=3" />
                        <AvatarFallback>A3</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarImage src="https://i.pravatar.cc/150?u=4" />
                        <AvatarFallback>A4</AvatarFallback>
                      </Avatar>
                      <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium z-10">
                        +42
                      </div>
                    </div>
                  )}
                </StatCard>
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title="MRR"
                  value={data?.primary.mrr.value || 0}
                  prefix={data?.primary.mrr.prefix}
                  suffix={data?.primary.mrr.suffix}
                  trend={data?.primary.mrr.trend}
                  trendValue={data?.primary.mrr.trendValue}
                  sparklineData={data?.primary.mrr.sparklineData}
                  icon={<Activity className="h-4 w-4" />}
                  isLoading={isLoading}
                />
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title="Churn Rate"
                  value={data?.primary.churn.value || 0}
                  prefix={data?.primary.churn.prefix}
                  suffix={data?.primary.churn.suffix}
                  trend={data?.primary.churn.trend}
                  trendValue={data?.primary.churn.trendValue}
                  sparklineData={data?.primary.churn.sparklineData}
                  icon={<LogOut className="h-4 w-4" />}
                  isLoading={isLoading}
                />
              </motion.div>
            </motion.div>

            {/* Secondary KPI Grid */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6"
            >
              <motion.div variants={slideUp}>
                <StatCard
                  title={data?.secondary.conversionRate.title || "Conversion Rate"}
                  value={data?.secondary.conversionRate.value || 0}
                  prefix={data?.secondary.conversionRate.prefix}
                  suffix={data?.secondary.conversionRate.suffix}
                  trend={data?.secondary.conversionRate.trend}
                  trendValue={data?.secondary.conversionRate.trendValue}
                  isLoading={isLoading}
                  compact
                />
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title={data?.secondary.clv.title || "Customer Lifetime Value"}
                  value={data?.secondary.clv.value || 0}
                  prefix={data?.secondary.clv.prefix}
                  suffix={data?.secondary.clv.suffix}
                  trend={data?.secondary.clv.trend}
                  trendValue={data?.secondary.clv.trendValue}
                  isLoading={isLoading}
                  compact
                />
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title={data?.secondary.netProfit.title || "Net Profit"}
                  value={data?.secondary.netProfit.value || 0}
                  prefix={data?.secondary.netProfit.prefix}
                  suffix={data?.secondary.netProfit.suffix}
                  trend={data?.secondary.netProfit.trend}
                  trendValue={data?.secondary.netProfit.trendValue}
                  isLoading={isLoading}
                  compact
                />
              </motion.div>
              <motion.div variants={slideUp}>
                <StatCard
                  title={data?.secondary.arpu.title || "Average Revenue Per User"}
                  value={data?.secondary.arpu.value || 0}
                  prefix={data?.secondary.arpu.prefix}
                  suffix={data?.secondary.arpu.suffix}
                  trend={data?.secondary.arpu.trend}
                  trendValue={data?.secondary.arpu.trendValue}
                  isLoading={isLoading}
                  compact
                />
              </motion.div>
            </motion.div>

            {/* Main Interactive Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <RevenueChart />
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4 mt-4">
              <SubscriptionChart />
              <SourcesChart />
            </div>

            {/* Extended Comparison & Cohort Panels */}
            <div className="grid gap-4 mt-4">
              <GrowthComparison />
              <RetentionCohort />
            </div>

            {/* Advanced Analytics Panels (Phase 8) */}
            <div className="grid gap-4 mt-4">
              <ActivityHeatmap />
            </div>
            
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4 mt-4">
              <CountryMap />
              <FunnelChart />
            </div>

            <div className="grid gap-4 mt-4">
              <SystemAnalytics />
            </div>

            {/* Recent Activity Timeline (Phase 9) */}
            <div className="grid gap-4 mt-4">
              <RecentActivity />
            </div>

            {/* Empty State Mock (for demonstration below the cards) */}
            {!isLoading && data && data.primary.activeUsers.value === 0 && (
               <Card className="mt-8 border-dashed border-2">
                 <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                     <UserPlus className="w-8 h-8 text-primary" />
                   </div>
                   <div className="space-y-1">
                     <h3 className="font-semibold text-lg">No active users yet</h3>
                     <p className="text-sm text-muted-foreground">Get started by inviting your first customer to the platform.</p>
                   </div>
                   <Button className="mt-4">
                     Invite Customer
                   </Button>
                 </CardContent>
               </Card>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
