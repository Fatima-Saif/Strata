'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerTickets } from '@/lib/api/customer-details';
import { Loader2, Ticket, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function TicketsTab({ userId }: { userId: string }) {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['customer-tickets', userId],
    queryFn: () => fetchCustomerTickets(userId),
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-background">
        <Ticket className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">No support tickets</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">This customer has not submitted any support requests.</p>
        <Button className="mt-6" variant="outline">Create Ticket on Behalf</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20">Open</Badge>;
      case 'Pending': return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20">Pending</Badge>;
      case 'Resolved': return <Badge variant="secondary" className="text-muted-foreground">Resolved</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Support History</h3>
        <Button size="sm" variant="outline">
          Create Ticket
        </Button>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                  {getStatusBadge(ticket.status)}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </span>
              </div>
              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {ticket.subject}
              </h4>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 rounded-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} priority
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
