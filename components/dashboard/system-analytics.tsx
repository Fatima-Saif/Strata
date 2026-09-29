'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchSystemAnalyticsData } from '@/lib/api/charts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Simple generic icons where SVG brand logos aren't readily available without massive imports
const CircleIcon = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5" fill={color}/>
  </svg>
);

export function SystemAnalytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: fetchSystemAnalyticsData,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-4 border-destructive/50">
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
          <CardDescription className="text-destructive">Failed to load system data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2 text-xs">
          <div className="flex items-center gap-2">
            <CircleIcon color={payload[0].payload.fill} />
            <span className="font-medium text-foreground">{payload[0].name}:</span>
            <span className="font-mono">{payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-2 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1.5">
            <CircleIcon color={entry.color} />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderDonut = (dataset: any[], title: string) => (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={dataset}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={800}
            >
              {dataset.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} style={{ outline: 'none' }} />
              ))}
            </Pie>
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>System & Devices</CardTitle>
        <CardDescription>User demographics by technology stack</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="pt-4 md:pt-0">{renderDonut(data.devices, "Device Type")}</div>
          <div className="pt-4 md:pt-0">{renderDonut(data.browsers, "Browser")}</div>
          <div className="pt-4 md:pt-0">{renderDonut(data.os, "Operating System")}</div>
        </div>
      </CardContent>
    </Card>
  );
}
