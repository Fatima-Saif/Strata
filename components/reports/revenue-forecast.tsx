'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueForecast } from '@/lib/api/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export function RevenueForecast() {
  const { data, isLoading } = useQuery({
    queryKey: ['revenue-forecast'],
    queryFn: fetchRevenueForecast,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Revenue Forecast
            </CardTitle>
            <CardDescription>6-month forward projection based on historical trends.</CardDescription>
          </div>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Projections are estimated using a simple moving average algorithm. Confidence bands indicate potential variance. Not guaranteed.
              </p>
            </TooltipContent>
          </UITooltip>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : !data ? null : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
                  width={60}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => {
                    if (name === 'historical') return [formatCurrency(value), 'Historical Revenue'];
                    if (name === 'forecast') return [formatCurrency(value), 'Projected Revenue'];
                    if (name === 'confidence') return [undefined, undefined]; // hide
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                
                {/* Confidence Band */}
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  stroke="none" 
                  fill="url(#colorConfidence)" 
                  name="confidence" 
                  tooltipType="none"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower" 
                  stroke="none" 
                  fill="hsl(var(--background))" 
                  name="confidence-lower" 
                  tooltipType="none"
                />

                {/* Historical Line */}
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />

                {/* Forecasted Line */}
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
