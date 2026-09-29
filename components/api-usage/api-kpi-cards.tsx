'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApiUsage } from '@/lib/api/api-usage';
import { StatCard } from '@/components/dashboard/stat-card';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export function ApiKpiCards() {
  const { data: usage, isLoading } = useQuery({
    queryKey: ['api-usage-kpi'],
    queryFn: fetchApiUsage,
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!usage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Requests"
        value={usage.totalRequests}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        trend="up"
        trendValue="12.5%"
      />
      <StatCard 
        title="Success Rate"
        value={usage.successRate}
        suffix="%"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        trend="up"
        trendValue="0.2%"
      />
      <StatCard 
        title="Failed Requests"
        value={usage.failedRequests}
        icon={<XCircle className="h-4 w-4 text-destructive" />}
        trend="down"
        trendValue="-5.4%"
      />
      <StatCard 
        title="Avg Latency"
        value={usage.avgLatency}
        suffix="ms"
        icon={<Clock className="h-4 w-4 text-amber-500" />}
        trend="down"
        trendValue="-12.3%"
      />
    </div>
  );
}
