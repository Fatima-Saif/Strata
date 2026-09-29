'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueSourcesData } from '@/lib/api/charts';
import { useDashboardFilter } from '@/store/use-dashboard-filter';
import { ChartWrapper } from '@/components/dashboard/chart-wrapper';

export function SourcesChart() {
  const { dateRange } = useDashboardFilter();
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();
  const [hiddenKeys, setHiddenKeys] = React.useState<string[]>([]);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sources-chart', dateRange],
    queryFn: () => fetchRevenueSourcesData(dateRange),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-full max-w-[300px] mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-destructive/50">
        <CardHeader>
          <CardTitle>Revenue Sources</CardTitle>
          <CardDescription className="text-destructive">Failed to load chart data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const columns = [
    { key: 'name', label: 'Source' },
    { key: 'value', label: 'Percentage', format: (val: any) => `${val}%` },
  ];

  // Filter data based on legend clicks
  const visibleData = data.filter(item => !hiddenKeys.includes(item.name));
  
  // Calculate total for the center overlay
  const total = visibleData.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const handleLegendClick = (dataKey: string) => {
    setHiddenKeys(prev => 
      prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2 text-sm flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.payload.fill }} />
          <span className="font-medium">{entry.name}:</span>
          <span className="font-bold">{entry.value}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartWrapper
      title="Revenue Sources"
      description="Percentage breakdown by channel"
      data={data}
      columns={columns}
      className="col-span-1 lg:col-span-2"
    >
      <div className="h-[300px] w-full relative">
        
        {/* Custom Center Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
          <span className="text-3xl font-bold font-mono">{total}%</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            
            <Pie
              data={visibleData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {visibleData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  style={{ 
                    outline: 'none',
                    opacity: activeIndex === index ? 1 : activeIndex !== undefined ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    transformOrigin: 'center',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  }} 
                />
              ))}
            </Pie>

            <Legend 
              verticalAlign="bottom" 
              height={36}
              content={(props) => {
                const { payload } = props;
                // Legend uses the original unfiltered data to allow toggling back on
                return (
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm mt-2">
                    {data.map((entry, index) => {
                      const isHidden = hiddenKeys.includes(entry.name);
                      return (
                        <button
                          key={`item-${index}`}
                          className={`flex items-center gap-1.5 transition-opacity ${isHidden ? 'opacity-40 grayscale' : 'opacity-100 hover:opacity-80'}`}
                          onClick={() => handleLegendClick(entry.name)}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                          <span className="text-muted-foreground">{entry.name}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
