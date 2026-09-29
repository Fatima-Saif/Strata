'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTenantUsage, fetchPlans, TenantUsage, PlanTier } from '@/lib/api/subscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, HardDrive, Users, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageBarProps {
  label: string;
  icon: React.ReactNode;
  current: number;
  max: number;
  unit?: string;
  formatValue?: (val: number) => string;
}

function UsageBar({ label, icon, current, max, unit = '', formatValue = (v) => v.toString() }: UsageBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  let colorClass = 'bg-emerald-500';
  let isWarning = false;
  if (percentage >= 80) {
    colorClass = 'bg-destructive';
    isWarning = true;
  } else if (percentage >= 60) {
    colorClass = 'bg-amber-500';
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 font-medium">
          {icon}
          {label}
        </div>
        <div className="text-muted-foreground">
          <span className={isWarning ? 'text-destructive font-bold' : 'text-foreground'}>
            {formatValue(current)}
          </span>
          {' / '}
          {formatValue(max)} {unit}
        </div>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isWarning ? "[&_[data-slot=progress-indicator]]:bg-destructive" :
          percentage >= 60 ? "[&_[data-slot=progress-indicator]]:bg-amber-500" :
          "[&_[data-slot=progress-indicator]]:bg-emerald-500"
        )} 
      />
      {isWarning && (
        <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 font-medium">
          <AlertTriangle className="h-3.5 w-3.5" />
          You are approaching your limit. Upgrade to increase.
        </div>
      )}
    </div>
  );
}

export function UsageIndicators() {
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
      <Card>
        <CardContent className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!usage || !plans) return null;

  const currentPlanDetails = plans.find(p => p.name === usage.currentPlan);
  if (!currentPlanDetails) return null;

  const limits = currentPlanDetails.limits;

  return (
    <Card className="border-primary/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {usage.currentPlan} Plan
        </div>
      </div>
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
        <CardDescription>
          Your workspace usage against the {usage.currentPlan} plan limits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UsageBar 
            label="Storage Space" 
            icon={<HardDrive className="h-4 w-4 text-muted-foreground" />} 
            current={usage.storageUsed} 
            max={limits.storageGb} 
            unit="GB"
            formatValue={(v) => v.toFixed(1)}
          />
          <UsageBar 
            label="Team Members" 
            icon={<Users className="h-4 w-4 text-muted-foreground" />} 
            current={usage.membersCount} 
            max={limits.members} 
          />
          <UsageBar 
            label="API Requests" 
            icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            current={usage.apiRequestsCount} 
            max={limits.apiRequests} 
            formatValue={(v) => v.toLocaleString()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
