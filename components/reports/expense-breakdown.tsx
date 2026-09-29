'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchExpenseBreakdown } from '@/lib/api/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export function ExpenseBreakdown() {
  const { data, isLoading } = useQuery({
    queryKey: ['expense-breakdown'],
    queryFn: fetchExpenseBreakdown,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Current period expenses by category.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : !data ? null : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
