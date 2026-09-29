'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchGrowthComparisonData, GrowthComparisonPoint } from '@/lib/api/charts';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { useTheme } from 'next-themes';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

export function GrowthComparison() {
  const [period, setPeriod] = React.useState<'month' | 'year'>('month');
  const { theme } = useTheme();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['growth-comparison', period],
    queryFn: () => fetchGrowthComparisonData(period),
    staleTime: 60 * 1000,
  });

  const isDark = theme === 'dark';
  const currentStroke = isDark ? '#a78bfa' : '#6366f1';
  const previousStroke = isDark ? '#4b5563' : '#9ca3af';

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-3 border-destructive/50">
        <CardHeader>
          <CardTitle>Growth Comparison</CardTitle>
          <CardDescription className="text-destructive">Failed to load comparison data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}k`;
  const formatUsers = (value: number) => value.toLocaleString();
  const formatChurn = (value: number) => `${value.toFixed(1)}%`;

  // Calculate totals and deltas
  const currentRev = data.reduce((sum, d) => sum + d.revenue.current, 0);
  const prevRev = data.reduce((sum, d) => sum + d.revenue.previous, 0);
  const revDelta = ((currentRev - prevRev) / prevRev) * 100;

  const currentUsr = data.reduce((sum, d) => sum + d.users.current, 0);
  const prevUsr = data.reduce((sum, d) => sum + d.users.previous, 0);
  const usrDelta = ((currentUsr - prevUsr) / prevUsr) * 100;

  const currentChurn = data.reduce((sum, d) => sum + d.churn.current, 0) / data.length;
  const prevChurn = data.reduce((sum, d) => sum + d.churn.previous, 0) / data.length;
  const churnDelta = currentChurn - prevChurn; // absolute difference for percentages

  const renderBadge = (delta: number, inverse = false) => {
    // Inverse means negative is good (e.g. churn)
    const isPositive = delta > 0;
    const isNeutral = delta === 0;
    
    let colorClass = 'text-muted-foreground bg-muted';
    let Icon = MinusIcon;
    
    if (!isNeutral) {
      if ((isPositive && !inverse) || (!isPositive && inverse)) {
        colorClass = 'text-success bg-success/10';
        Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
      } else {
        colorClass = 'text-danger bg-danger/10';
        Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
      }
    }

    return (
      <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {!isNeutral && <Icon className="w-3 h-3 mr-1" />}
        {Math.abs(delta).toFixed(1)}%
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2 text-xs">
          <p className="font-semibold mb-1 text-center">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-medium">{formatter(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Restructure data for Recharts dot-notation access
  const chartData = data.map(d => ({
    date: d.date,
    revCurrent: d.revenue.current,
    revPrevious: d.revenue.previous,
    usrCurrent: d.users.current,
    usrPrevious: d.users.previous,
    churnCurrent: d.churn.current,
    churnPrevious: d.churn.previous,
  }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Growth Comparison</CardTitle>
          <CardDescription>Side-by-side performance metrics</CardDescription>
        </div>
        <Select value={period} onValueChange={(val) => setPeriod(val as 'month' | 'year')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select comparison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month vs Last</SelectItem>
            <SelectItem value="year">This Year vs Last</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Revenue Mini-Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold font-mono">{formatCurrency(currentRev)}</p>
              </div>
              {renderBadge(revDelta)}
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} syncId="growthSync">
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip content={<CustomTooltip formatter={formatCurrency} />} cursor={{ stroke: 'var(--border)' }} />
                  <Line type="monotone" dataKey="revPrevious" name="Previous" stroke={previousStroke} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="revCurrent" name="Current" stroke={currentStroke} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Users Mini-Chart */}
          <div className="space-y-2 relative md:before:content-[''] md:before:absolute md:before:left-[-16px] md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">New Users</p>
                <p className="text-2xl font-bold font-mono">{formatUsers(currentUsr)}</p>
              </div>
              {renderBadge(usrDelta)}
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} syncId="growthSync">
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip content={<CustomTooltip formatter={formatUsers} />} cursor={{ stroke: 'var(--border)' }} />
                  <Line type="monotone" dataKey="usrPrevious" name="Previous" stroke={previousStroke} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="usrCurrent" name="Current" stroke={currentStroke} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Churn Mini-Chart */}
          <div className="space-y-2 relative md:before:content-[''] md:before:absolute md:before:left-[-16px] md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg Churn Rate</p>
                <p className="text-2xl font-bold font-mono">{formatChurn(currentChurn)}</p>
              </div>
              {renderBadge(churnDelta, true)}
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} syncId="growthSync">
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip content={<CustomTooltip formatter={formatChurn} />} cursor={{ stroke: 'var(--border)' }} />
                  <Line type="monotone" dataKey="churnPrevious" name="Previous" stroke={previousStroke} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="churnCurrent" name="Current" stroke={currentStroke} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
        <div className="flex justify-center mt-6 gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[var(--primary)]" style={{ backgroundColor: currentStroke }} />
            <span>Current Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-muted-foreground border-t border-dashed" style={{ borderColor: previousStroke }} />
            <span>Previous Period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
