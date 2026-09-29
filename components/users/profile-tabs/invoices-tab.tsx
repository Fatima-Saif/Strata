'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerInvoices } from '@/lib/api/customer-details';
import { Loader2, Download, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function InvoicesTab({ userId }: { userId: string }) {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['customer-invoices', userId],
    queryFn: () => fetchCustomerInvoices(userId),
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-background">
        <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">No invoices found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">This customer hasn't been billed yet.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">Paid</Badge>;
      case 'Pending': return <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10">Pending</Badge>;
      case 'Overdue': return <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">Overdue</Badge>;
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Billing History</h3>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export All
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        {invoices.map((invoice, i) => (
          <div key={invoice.id} className={`flex items-center justify-between p-4 ${i !== invoices.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors`}>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  {invoice.id}
                  {getStatusBadge(invoice.status)}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Billed on {format(new Date(invoice.date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-lg">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">USD</p>
              </div>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex shrink-0">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
