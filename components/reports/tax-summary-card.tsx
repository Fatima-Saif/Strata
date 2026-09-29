'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueReports } from '@/lib/api/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Loader2 } from 'lucide-react';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export function TaxSummaryCard() {
  const [taxRate, setTaxRate] = React.useState<number>(21); // Default 21% Corporate Tax

  // Use annual reports for the tax summary
  const { data, isLoading } = useQuery({
    queryKey: ['revenue-reports', 'year'],
    queryFn: () => fetchRevenueReports('year'),
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex justify-center p-12 h-full items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) return null;

  // Use the most recent completed year or current year
  const latestYear = data[data.length - 1];
  const netProfit = latestYear.revenue - latestYear.expenses;
  const estimatedTax = netProfit * (taxRate / 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-muted-foreground" />
          Tax Summary
        </CardTitle>
        <CardDescription>Estimated tax liability for {latestYear.period}.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Gross Revenue</span>
            <span className="font-medium">{formatCurrency(latestYear.revenue)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Total Deductions</span>
            <span className="font-medium">{formatCurrency(latestYear.expenses)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Net Taxable Income</span>
            <span className="font-bold text-foreground">{formatCurrency(netProfit)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-4 bg-muted/50 p-4 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="tax-rate" className="text-xs">Configurable Tax Rate (%)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="tax-rate"
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)} 
                className="w-24 h-8"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-1">Estimated Tax Owed</div>
            <div className="text-3xl font-bold font-mono text-destructive tracking-tight">
              {formatCurrency(estimatedTax)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
