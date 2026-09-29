'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueChartData } from '@/lib/api/charts';
import { useDashboardFilter } from '@/store/use-dashboard-filter';
import { useTheme } from 'next-themes';
import { ChartWrapper } from '@/components/dashboard/chart-wrapper';

export function RevenueChart() {
  const { dateRange, comparePrevious } = useDashboardFilter();
  const { theme } = useTheme();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['revenue-chart', dateRange, comparePrevious],
    queryFn: () => fetchRevenueChartData(dateRange, comparePrevious),
    staleTime: 60 * 1000,
  });

  const isDark = theme === 'dark';
  const currentStroke = isDark ? '#a78bfa' : '#6366f1';
  const previousStroke = isDark ? '#4b5563' : '#9ca3af';

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-3 border-destructive/50">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription className="text-destructive">Failed to load chart data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'current', label: 'Current Revenue', format: formatCurrency },
  ];
  if (comparePrevious) {
    columns.push({ key: 'previous', label: 'Previous Revenue', format: formatCurrency });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const isCurrent = entry.dataKey === 'current';
            const valueFormatted = formatCurrency(entry.value);
            return (
              <div key={index} className="flex items-center justify-between gap-4 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground capitalize">{isCurrent ? 'Current' : 'Previous'}</span>
                </div>
                <span className="font-bold font-mono">{valueFormatted}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartWrapper
      title="Revenue Analytics"
      description={`Daily revenue breakdown for ${dateRange === 'today' ? 'today' : dateRange === 'week' ? 'this week' : dateRange === 'month' ? 'this month' : 'this period'}`}
      data={data}
      columns={columns}
      className="col-span-1 lg:col-span-3"
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentStroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={currentStroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {comparePrevious && (
              <Area
                type="monotone"
                dataKey="previous"
                stroke={previousStroke}
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="transparent"
                name="Previous"
                isAnimationActive={true}
                animationDuration={1000}
              />
            )}
            
            <Area
              type="monotone"
              dataKey="current"
              stroke={currentStroke}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCurrent)"
              name="Current"
              isAnimationActive={true}
              animationDuration={1000}
            />
            
            {comparePrevious && (
              <Legend 
                verticalAlign="top" 
                height={36}
                content={(props) => {
                  const { payload } = props;
                  return (
                    <div className="flex items-center justify-end gap-4 text-sm mb-4">
                      {payload?.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {entry.value === 'Previous' ? (
                            <div className="w-4 border-b-2 border-dashed" style={{ borderColor: entry.color }} />
                          ) : (
                            <div className="w-4 border-b-2" style={{ borderColor: entry.color }} />
                          )}
                          <span className="text-muted-foreground">{entry.value} Period</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
