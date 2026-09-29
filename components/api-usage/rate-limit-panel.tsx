'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTenantUsage, fetchPlans } from '@/lib/api/subscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RateLimitPanel() {
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['tenant-usage'],
    queryFn: fetchTenantUsage,
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: fetchPlans,
  });

  if (usageLoading || plansLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex justify-center p-12 h-full items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!usage || !plans) return null;

  const currentPlanDetails = plans.find(p => p.name === usage.currentPlan);
  if (!currentPlanDetails) return null;

  const current = usage.apiRequestsCount;
  const max = currentPlanDetails.limits.apiRequests;
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  let colorClass = "[&_[data-slot=progress-indicator]]:bg-emerald-500";
  let isWarning = false;
  if (percentage >= 90) {
    colorClass = "[&_[data-slot=progress-indicator]]:bg-destructive";
    isWarning = true;
  } else if (percentage >= 75) {
    colorClass = "[&_[data-slot=progress-indicator]]:bg-amber-500";
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Rate Limits</CardTitle>
        <CardDescription>Current billing cycle API request quota.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center gap-2 font-medium">
              <Activity className="h-4 w-4 text-muted-foreground" />
              API Requests
            </div>
            <div className="text-muted-foreground">
              <span className={isWarning ? 'text-destructive font-bold' : 'text-foreground'}>
                {current.toLocaleString()}
              </span>
              {' / '}
              {max.toLocaleString()}
            </div>
          </div>
          
          <Progress 
            value={percentage} 
            className={cn("h-3", colorClass)} 
          />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
            <span>{percentage.toFixed(1)}% Used</span>
            <span>Resets in 12 days</span>
          </div>

          {isWarning && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-medium flex gap-2 mt-4 items-start">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                You are approaching your API rate limit. Once reached, further requests will be rejected with a 429 status code.
              </div>
            </div>
          )}
          
          <div className="pt-4 mt-auto">
            <Link href="/subscriptions" className="block w-full">
              <Button variant="outline" className="w-full">Upgrade Plan</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
