'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSecurityFactors } from '@/lib/api/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Loader2, ShieldAlert, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SecurityScoreCard() {
  const { data: factors, isLoading } = useQuery({
    queryKey: ['security-factors'],
    queryFn: fetchSecurityFactors,
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

  if (!factors) return null;

  let score = 100;
  if (!factors.twoFactorEnabled) score -= 40;
  if (!factors.recentPasswordChange) score -= 15;
  if (!factors.noLeakedCredentials) score -= 50;
  
  // ensure score is bound
  score = Math.max(0, Math.min(100, score));

  const color = score >= 80 ? 'hsl(var(--success))' : score >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';
  
  const chartData = [
    { name: 'Score', value: score, fill: color },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {score >= 80 ? (
            <ShieldCheck className="h-5 w-5 text-success" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-warning" />
          )}
          Security Score
        </CardTitle>
        <CardDescription>Your account security health.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center">
        <div className="relative w-40 h-40 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              innerRadius="70%" 
              outerRadius="100%" 
              barSize={15} 
              data={chartData} 
              startAngle={90} 
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar 
                background={{ fill: 'hsl(var(--muted))' }} 
                dataKey="value" 
                cornerRadius={10} 
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono">{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="w-full mt-6 space-y-3">
          <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
          
          <div className="flex items-center gap-3 text-sm">
            {factors.twoFactorEnabled ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={factors.twoFactorEnabled ? 'text-muted-foreground line-through' : 'text-foreground'}>
              Enable Two-Factor Authentication
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {factors.recentPasswordChange ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={factors.recentPasswordChange ? 'text-muted-foreground line-through' : 'text-foreground'}>
              Update password regularly
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {factors.noLeakedCredentials ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
            )}
            <span className={factors.noLeakedCredentials ? 'text-muted-foreground line-through' : 'text-destructive font-medium'}>
              No leaked credentials found
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
