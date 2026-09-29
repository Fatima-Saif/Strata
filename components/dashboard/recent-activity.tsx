'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CreditCard, UserPlus, Settings, ShieldAlert, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ActivityEvent = {
  id: string;
  title: string;
  type: 'billing' | 'user' | 'system' | 'security' | 'upgrade';
  timestamp: Date;
};

// Initial static seed
const generateInitialEvents = (): ActivityEvent[] => {
  const now = Date.now();
  return [
    { id: '1', title: 'Ahmed upgraded to Pro Plan', type: 'upgrade', timestamp: new Date(now - 1000 * 60 * 2) },
    { id: '2', title: 'Invoice #432 Paid', type: 'billing', timestamp: new Date(now - 1000 * 60 * 60) },
    { id: '3', title: 'Team member Sarah invited', type: 'user', timestamp: new Date(now - 1000 * 60 * 60 * 24) },
    { id: '4', title: 'System maintenance completed', type: 'system', timestamp: new Date(now - 1000 * 60 * 60 * 48) },
    { id: '5', title: 'Failed login attempt from new IP', type: 'security', timestamp: new Date(now - 1000 * 60 * 60 * 72) },
  ];
};

export function RecentActivity() {
  const [events, setEvents] = React.useState<ActivityEvent[]>(generateInitialEvents);
  const [loading, setLoading] = React.useState(false);
  const [timeTick, setTimeTick] = React.useState(0);

  // Force re-render every minute to update relative timestamps
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMore = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const lastTimestamp = events[events.length - 1].timestamp.getTime();
      const newEvents: ActivityEvent[] = [
        { id: Math.random().toString(), title: 'Invoice #431 Paid', type: 'billing', timestamp: new Date(lastTimestamp - 1000 * 60 * 60 * 24 * 2) },
        { id: Math.random().toString(), title: 'New API Key generated', type: 'security', timestamp: new Date(lastTimestamp - 1000 * 60 * 60 * 24 * 3) },
        { id: Math.random().toString(), title: 'John changed role to Admin', type: 'user', timestamp: new Date(lastTimestamp - 1000 * 60 * 60 * 24 * 5) },
      ];
      setEvents(prev => [...prev, ...newEvents]);
      setLoading(false);
    }, 800);
  };

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch(type) {
      case 'billing': return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'user': return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'system': return <Settings className="h-4 w-4 text-muted-foreground" />;
      case 'security': return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case 'upgrade': return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Timeline of events across your organization</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No recent activity.
          </div>
        ) : (
          <div className="relative border-l border-border ml-3 pl-6 space-y-6 flex-1">
            {events.map((event, i) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <span className="absolute -left-[31px] bg-background border border-border p-1 rounded-full flex items-center justify-center">
                  {getEventIcon(event.type)}
                </span>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-sm font-medium text-foreground">{event.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-6 mt-auto text-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadMore} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
