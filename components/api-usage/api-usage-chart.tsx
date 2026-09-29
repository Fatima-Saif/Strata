'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApiTimeSeries } from '@/lib/api/api-usage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md text-sm">
        <p className="font-semibold mb-2">{format(new Date(label), 'MMM d, yyyy')}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground capitalize">{entry.name}</span>
            </div>
            <span className="font-medium">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-4">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="font-bold">
            {((payload[0]?.value as number) + (payload[1]?.value as number)).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function ApiUsageChart() {
  const [days, setDays] = React.useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ['api-time-series', days],
    queryFn: () => fetchApiTimeSeries(days),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>API Requests</CardTitle>
          <CardDescription>Request volume over time</CardDescription>
        </div>
        <Select value={days.toString()} onValueChange={(v: string | null) => v && setDays(parseInt(v))}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), 'MMM d')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorSuccess)" 
                  strokeWidth={2}
                  name="Successful"
                />
                <Area 
                  type="monotone" 
                  dataKey="failed" 
                  stackId="1" 
                  stroke="hsl(var(--destructive))" 
                  fill="url(#colorFailed)" 
                  strokeWidth={2}
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
