'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from 'next-themes';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  sparklineData?: { value: number }[];
  isLoading?: boolean;
  className?: string;
  gradient?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  icon,
  sparklineData,
  isLoading,
  className,
  gradient,
  compact,
  children,
}: StatCardProps) {
  const { theme } = useTheme();
  
  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className={cn("flex flex-row items-center justify-between pb-2 space-y-0", compact && "pb-1")}>
          <Skeleton className={cn("h-5 w-24", compact && "h-4 w-16")} />
          {!compact && <Skeleton className="h-4 w-4 rounded-full" />}
        </CardHeader>
        <CardContent className={cn(compact && "pb-4 pt-0")}>
          <Skeleton className={cn("h-8 w-20 mb-2", compact && "h-6 w-16 mb-1")} />
          <Skeleton className={cn("h-4 w-32", compact && "h-3 w-20")} />
          {sparklineData && !compact && <Skeleton className="h-[40px] w-full mt-4" />}
        </CardContent>
      </Card>
    );
  }

  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#a78bfa' : '#6366f1'; // Premium primary colors

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-md relative',
        gradient && 'bg-gradient-to-br from-background to-muted/50 border-primary/10',
        compact && 'shadow-sm',
        className
      )}
    >
      <CardHeader className={cn("flex flex-row items-center justify-between pb-2 space-y-0", compact && "pb-1 pt-4")}>
        <CardTitle className={cn("text-sm font-medium text-muted-foreground", compact && "text-xs")}>{title}</CardTitle>
        {icon && !compact && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className={cn(compact && "pb-4 pt-0")}>
        <div className={cn("text-2xl font-bold font-mono", compact && "text-xl")}>
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </div>
        
        {(trend || trendValue) && (
          <div className="flex items-center text-xs mt-1">
            {trend === 'up' && <ArrowUpIcon className="mr-1 h-3 w-3 text-success" />}
            {trend === 'down' && <ArrowDownIcon className="mr-1 h-3 w-3 text-danger" />}
            {trend === 'neutral' && <MinusIcon className="mr-1 h-3 w-3 text-muted-foreground" />}
            
            <span
              className={cn(
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-danger',
                trend === 'neutral' && 'text-muted-foreground',
                'font-medium'
              )}
            >
              {trendValue}
            </span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-[40px] w-full mt-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={strokeColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
}
