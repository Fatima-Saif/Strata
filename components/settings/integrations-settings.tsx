'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const INTEGRATIONS = [
  { id: 'google', name: 'Google Calendar', description: 'Sync your external meetings and events into your dashboard calendar.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.1v2.8h5.36c-.23 1.25-1 2.3-2.13 3l3.44 2.66c2-1.85 3.16-4.57 3.16-7.53 0-.52-.05-1.03-.13-1.53z"/><path fill="#34A853" d="M12.25 21.5c2.6 0 4.79-.86 6.38-2.33l-3.44-2.66c-.86.58-1.97.92-3.16.92-2.43 0-4.5-1.64-5.23-3.84H3.25v2.75C5 19.83 8.35 21.5 12.25 21.5z"/><path fill="#FBBC05" d="M7.02 13.59A5.85 5.85 0 016.73 12c0-.55.1-1.08.29-1.59V7.66H3.25A9.97 9.97 0 002 12c0 1.62.39 3.16 1.07 4.54l3.95-2.95z"/><path fill="#EA4335" d="M12.25 6.55c1.42 0 2.68.49 3.68 1.45l2.76-2.76C17.04 3.75 14.85 2.87 12.25 2.87 8.35 2.87 5 4.54 3.25 7.66l3.77 2.93c.73-2.2 2.8-3.84 5.23-3.84z"/></svg> },
  { id: 'stripe', name: 'Stripe', description: 'Connect Stripe to manage payments and subscriptions directly.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-1.087-.504-2.859-.872-4.255-.872-2.28 0-3.882 1.144-3.882 2.764 0 1.554 1.155 2.115 2.977 2.637 2.213.626 3.018 1.196 3.018 2.308 0 1.34-1.22 2.083-3.084 2.083-1.636 0-3.32-.47-4.63-1.225l-.654 3.125c1.385.744 3.493 1.168 5.485 1.168 2.678 0 4.192-1.258 4.192-3.003 0-1.625-1.226-2.22-3.26-2.827-2.02-.588-2.618-1.042-2.618-1.928 0-1.054 1.084-1.782 2.712-1.782 1.257 0 2.51.353 3.518.91l.531-2.527v-.031z"/></svg> },
  { id: 'slack', name: 'Slack', description: 'Send automated alerts and notifications to Slack channels.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.521zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg> },
  { id: 'github', name: 'GitHub', description: 'Connect repositories to track pull requests and issues.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
];

export function IntegrationsSettings() {
  const { isGoogleConnected, isConnectingGoogle, connectGoogleCalendar, disconnectGoogleCalendar } = useCalendarStore();
  const [mockConnected, setMockConnected] = React.useState<Record<string, boolean>>({});

  const handleToggleGoogle = async () => {
    if (isGoogleConnected) {
      if (confirm('Disconnecting Google Calendar will remove external events. Are you sure?')) {
        disconnectGoogleCalendar();
        toast.success('Google Calendar disconnected');
      }
    } else {
      await connectGoogleCalendar();
      toast.success('Google Calendar connected');
    }
  };

  const handleToggleMock = (id: string) => {
    const isConn = !!mockConnected[id];
    if (isConn) {
      setMockConnected(prev => ({ ...prev, [id]: false }));
      toast.success(`${id} disconnected`);
    } else {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 800)).then(() => {
          setMockConnected(prev => ({ ...prev, [id]: true }));
        }),
        {
          loading: 'Connecting...',
          success: `${id} connected successfully!`,
          error: 'Connection failed'
        }
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {INTEGRATIONS.map(integration => {
        const isGoogle = integration.id === 'google';
        const isConnected = isGoogle ? isGoogleConnected : !!mockConnected[integration.id];
        const isLoading = isGoogle ? isConnectingGoogle : false;

        return (
          <Card key={integration.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border rounded-md shadow-sm">
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center justify-between">
                      {integration.name}
                      {isConnected && <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Connected</span>}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  {integration.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? `Last synced: ${new Date().toLocaleTimeString()}` : 'Not connected'}
                  </span>
                  <Button 
                    variant={isConnected ? "outline" : "default"} 
                    onClick={isGoogle ? handleToggleGoogle : () => handleToggleMock(integration.id)} 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
