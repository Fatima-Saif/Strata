'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLoginHistory } from '@/lib/api/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function LoginHistory() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['login-history'],
    queryFn: fetchLoginHistory,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>Recent authentication attempts for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.length ? (
                  history.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {format(new Date(login.date), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {login.location}
                      </TableCell>
                      <TableCell className="text-sm">
                        {login.device}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {login.ip}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={login.status === 'success' ? 'default' : 'destructive'}
                          className={
                            login.status === 'success' 
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none'
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none'
                          }
                        >
                          {login.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No login history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
