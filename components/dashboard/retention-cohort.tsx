'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchRetentionCohortData } from '@/lib/api/charts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function RetentionCohort() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['retention-cohort'],
    queryFn: fetchRetentionCohortData,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-3 border-destructive/50">
        <CardHeader>
          <CardTitle>Cohort Retention</CardTitle>
          <CardDescription className="text-destructive">Failed to load cohort data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const getCellColor = (percentage: number | null) => {
    if (percentage === null) return 'transparent';
    // Base color matches primary (indigo-500 roughly). Opacity scales with percentage.
    // Assuming a light theme baseline for simplicity, but we can use CSS variables.
    // We'll use an rgba representation of our primary hue.
    const opacity = percentage / 100;
    return `hsla(var(--primary) / ${opacity * 0.8 + 0.1})`; // Min 10% opacity, max 90%
  };

  const getTextColor = (percentage: number | null) => {
    if (percentage === null) return 'text-transparent';
    return percentage > 50 ? 'text-primary-foreground' : 'text-foreground';
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Cohort Retention Snapshot</CardTitle>
        <CardDescription>Percentage of users retained over a 6-month period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-3 px-4 font-medium whitespace-nowrap">Cohort</th>
                <th className="py-3 px-4 font-medium text-right">Users</th>
                <th className="py-3 px-2 font-medium text-center">Month 0</th>
                <th className="py-3 px-2 font-medium text-center">Month 1</th>
                <th className="py-3 px-2 font-medium text-center">Month 2</th>
                <th className="py-3 px-2 font-medium text-center">Month 3</th>
                <th className="py-3 px-2 font-medium text-center">Month 4</th>
                <th className="py-3 px-2 font-medium text-center">Month 5</th>
                <th className="py-3 px-2 font-medium text-center">Month 6</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{row.cohort}</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">{row.users.toLocaleString()}</td>
                  {[0, 1, 2, 3, 4, 5, 6].map((m) => {
                    const pct = (row as any)[`m${m}`];
                    const absolute = pct !== null ? Math.floor(row.users * (pct / 100)) : null;
                    
                    return (
                      <td key={m} className="p-1 min-w-[80px]">
                        {pct !== null ? (
                          <TooltipProvider delay={100}>
                            <Tooltip>
                              <TooltipTrigger className={`w-full h-10 flex items-center justify-center rounded-sm font-medium cursor-default transition-colors ${getTextColor(pct)}`} style={{ backgroundColor: getCellColor(pct) }}>
                                {pct}%
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-semibold text-center mb-1">{row.cohort} - Month {m}</p>
                                <p className="text-xs">{absolute?.toLocaleString()} retained users</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="w-full h-10 bg-muted/20 rounded-sm" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-6 text-xs text-muted-foreground">
          <span>Lower Retention</span>
          <div className="flex w-32 h-2 rounded-full overflow-hidden border">
            <div className="flex-1" style={{ backgroundColor: getCellColor(10) }} />
            <div className="flex-1" style={{ backgroundColor: getCellColor(30) }} />
            <div className="flex-1" style={{ backgroundColor: getCellColor(50) }} />
            <div className="flex-1" style={{ backgroundColor: getCellColor(70) }} />
            <div className="flex-1" style={{ backgroundColor: getCellColor(90) }} />
          </div>
          <span>Higher Retention</span>
        </div>
      </CardContent>
    </Card>
  );
}
