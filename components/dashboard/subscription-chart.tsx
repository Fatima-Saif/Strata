'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptionChartData } from '@/lib/api/charts';
import { useDashboardFilter } from '@/store/use-dashboard-filter';
import { ChartWrapper } from '@/components/dashboard/chart-wrapper';

export function SubscriptionChart() {
  const { dateRange } = useDashboardFilter();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['subscription-chart', dateRange],
    queryFn: () => fetchSubscriptionChartData(dateRange),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-destructive/50">
        <CardHeader>
          <CardTitle>Subscription Growth</CardTitle>
          <CardDescription className="text-destructive">Failed to load chart data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'free', label: 'Free' },
    { key: 'starter', label: 'Starter' },
    { key: 'pro', label: 'Pro' },
    { key: 'enterprise', label: 'Enterprise' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      
      // Calculate total
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      
      // Find previous month data for delta calculation if possible
      const currentIndex = data.findIndex(d => d.month === label);
      const prevData = currentIndex > 0 ? data[currentIndex - 1] : null;
      
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm min-w-[200px]">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="font-semibold">{label}</span>
            <span className="font-bold text-foreground">Total: {total}</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const prevValue = prevData ? (prevData as any)[entry.dataKey] : entry.value;
              const delta = entry.value - prevValue;
              const deltaFormatted = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '0';
              const deltaColor = delta > 0 ? 'text-success' : delta < 0 ? 'text-danger' : 'text-muted-foreground';
              
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground capitalize">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{entry.value}</span>
                    <span className={`text-[10px] font-mono ${deltaColor} w-6 text-right`}>
                      {currentIndex === 0 ? '' : deltaFormatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartWrapper
      title="Subscription Growth"
      description="Monthly active subscribers by tier"
      data={data}
      columns={columns}
      className="col-span-1 lg:col-span-2"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            
            <Bar dataKey="free" name="Free" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 4, 4]} isAnimationActive={true} animationDuration={1000} />
            <Bar dataKey="starter" name="Starter" stackId="a" fill="hsl(var(--chart-2))" isAnimationActive={true} animationDuration={1000} />
            <Bar dataKey="pro" name="Pro" stackId="a" fill="hsl(var(--chart-3))" isAnimationActive={true} animationDuration={1000} />
            <Bar dataKey="enterprise" name="Enterprise" stackId="a" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
