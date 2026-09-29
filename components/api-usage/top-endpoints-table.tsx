'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopEndpoints } from '@/lib/api/api-usage';
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

export function TopEndpointsTable() {
  const { data: endpoints, isLoading } = useQuery({
    queryKey: ['top-endpoints'],
    queryFn: fetchTopEndpoints,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Endpoints</CardTitle>
        <CardDescription>Most frequently accessed API routes.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Avg Latency</TableHead>
                  <TableHead className="text-right">Error Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints?.length ? (
                  endpoints.map((endpoint, i) => {
                    const isHighError = endpoint.errorRate > 5.0;
                    
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] uppercase font-mono ${
                              endpoint.method === 'GET' ? 'text-blue-500 bg-blue-500/10' :
                              endpoint.method === 'POST' ? 'text-emerald-500 bg-emerald-500/10' :
                              endpoint.method === 'PUT' ? 'text-amber-500 bg-amber-500/10' :
                              'text-destructive bg-destructive/10'
                            }`}>
                              {endpoint.method}
                            </Badge>
                            <span className="font-mono text-sm">{endpoint.path}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {endpoint.requestCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {endpoint.avgLatency}ms
                        </TableCell>
                        <TableCell className={`text-right font-medium ${isHighError ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {endpoint.errorRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No API activity recorded yet.
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
