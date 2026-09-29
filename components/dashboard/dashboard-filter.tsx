'use client';

import * as React from 'react';
import { useDashboardFilter, DateRange } from '@/store/use-dashboard-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function DashboardFilter() {
  const { dateRange, setDateRange, comparePrevious, setComparePrevious } = useDashboardFilter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card rounded-lg border shadow-sm mb-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="date-range" className="text-muted-foreground hidden sm:inline-block">Date Range:</Label>
        <Select value={dateRange} onValueChange={(val) => setDateRange(val as DateRange)}>
          <SelectTrigger id="date-range" className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 sm:ml-auto">
        <Switch 
          id="compare-previous" 
          checked={comparePrevious}
          onCheckedChange={setComparePrevious}
        />
        <Label htmlFor="compare-previous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Compare to previous period
        </Label>
      </div>
    </div>
  );
}
