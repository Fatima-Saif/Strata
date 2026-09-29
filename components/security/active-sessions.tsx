'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchActiveSessions, revokeSession, revokeAllOtherSessions } from '@/lib/api/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Monitor, Smartphone, Globe, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export function ActiveSessions() {
  const queryClient = useQueryClient();
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: fetchActiveSessions,
  });

  const revokeMutation = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      toast.success('Session revoked');
    }
  });

  const revokeAllMutation = useMutation({
    mutationFn: revokeAllOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-sessions'] });
      toast.success('All other sessions revoked');
    }
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Devices currently logged into your account.</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => revokeAllMutation.mutate()}
          disabled={revokeAllMutation.isPending || !sessions || sessions.length <= 1}
        >
          {revokeAllMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          Revoke all others
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            {sessions?.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                    {session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('mobile') ? (
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    ) : session.device.toLowerCase().includes('mac') || session.device.toLowerCase().includes('windows') ? (
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{session.device}</p>
                      {session.current && (
                        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      <p>{session.browser} • {session.ip}</p>
                      <p>{session.location} • Last active {formatDistanceToNow(new Date(session.lastActive))} ago</p>
                    </div>
                  </div>
                </div>
                
                {!session.current && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => revokeMutation.mutate(session.id)}
                    disabled={revokeMutation.isPending}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
