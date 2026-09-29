'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueReports } from '@/lib/api/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

function ReportView({ type }: { type: 'month' | 'quarter' | 'year' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['revenue-reports', type],
    queryFn: () => fetchRevenueReports(type),
  });

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="period" 
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
              formatter={(value: any, name: any) => [formatCurrency(value), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Expenses</TableHead>
              <TableHead className="text-right">Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice().reverse().map((row) => (
              <TableRow key={row.period}>
                <TableCell className="font-medium">
                  {row.period}
                  {row.isPartial && <Badge variant="outline" className="ml-2 text-[10px] uppercase">Current</Badge>}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(row.expenses)}</TableCell>
                <TableCell className="text-right font-medium text-emerald-600">
                  {row.profitMargin.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function RevenueSummaryReports() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Historical financial performance.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="month" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="quarter">Quarterly</TabsTrigger>
            <TabsTrigger value="year">Annual</TabsTrigger>
          </TabsList>
          <TabsContent value="month" className="mt-0"><ReportView type="month" /></TabsContent>
          <TabsContent value="quarter" className="mt-0"><ReportView type="quarter" /></TabsContent>
          <TabsContent value="year" className="mt-0"><ReportView type="year" /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
