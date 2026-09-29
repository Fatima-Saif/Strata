'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CreditCard, UserPlus, Settings, ShieldAlert, ArrowUpRight, Loader2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ActivityEvent = {
  id: string;
  title: string;
  type: 'billing' | 'user' | 'system' | 'security' | 'upgrade';
  timestamp: Date;
};

// Generate deterministic activity for a specific user ID for demo purposes
const generateMockUserActivity = (userId: string): ActivityEvent[] => {
  const now = Date.now();
  const seed = userId.charCodeAt(0) || 1;
  
  if (seed % 3 === 0) return []; // Some users have no activity
  
  return [
    { id: 'a1', title: 'Logged in from new IP (192.168.1.1)', type: 'security', timestamp: new Date(now - 1000 * 60 * 60 * 2) },
    { id: 'a2', title: 'Upgraded plan to Pro', type: 'upgrade', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 3) },
    { id: 'a3', title: 'Paid Invoice #INV-1234', type: 'billing', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 3.5) },
    { id: 'a4', title: 'Changed profile picture', type: 'user', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 10) },
    { id: 'a5', title: 'Account created', type: 'system', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 45) },
  ];
};

export function ActivityTab({ userId }: { userId: string }) {
  const [events, setEvents] = React.useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate network fetch
    const timer = setTimeout(() => {
      setEvents(generateMockUserActivity(userId));
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [userId]);

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch(type) {
      case 'billing': return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'user': return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'system': return <Settings className="h-4 w-4 text-muted-foreground" />;
      case 'security': return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case 'upgrade': return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-background">
        <UserMinus className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">No recent activity</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">This customer hasn't performed any logged actions recently.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="relative border-l-2 border-border ml-4 pl-8 space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <span className="absolute -left-[43px] bg-background border-2 border-border p-1.5 rounded-full flex items-center justify-center">
              {getEventIcon(event.type)}
            </span>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{event.title}</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(event.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button variant="outline" size="sm">
          Load older events
        </Button>
      </div>
    </div>
  );
}
