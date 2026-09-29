'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSecurityEvents } from '@/lib/api/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Key, LogIn, Settings, ShieldAlert, Loader2 } from 'lucide-react';

export function SecurityEventsFeed() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: fetchSecurityEvents,
  });

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'password_change': return <Key className="h-4 w-4 text-emerald-500" />;
      case 'login': return <LogIn className="h-4 w-4 text-blue-500" />;
      case 'permission': return <Settings className="h-4 w-4 text-amber-500" />;
      case '2fa': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
      default: return <ShieldAlert className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Security Events</CardTitle>
        <CardDescription>Audit log of security-related actions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No recent security events.
          </div>
        ) : (
          <div className="relative border-l border-border ml-3 pl-6 space-y-6 flex-1">
            {events.map((event) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <span className="absolute -left-[31px] bg-background border border-border p-1 rounded-full flex items-center justify-center">
                  {getEventIcon(event.type)}
                </span>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <span className="text-sm font-medium text-foreground">{event.description}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
