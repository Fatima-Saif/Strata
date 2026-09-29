'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '@/lib/api/invoices';
import { InvoiceDataTable } from './data-table';
import { PaymentMethods } from './payment-methods';
import { Loader2 } from 'lucide-react';

export function InvoicesClient() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  return (
    <div className="space-y-10 pb-10">
      <section>
        <PaymentMethods />
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Invoice History</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View and manage all your past and pending invoices.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-24 bg-card rounded-md border"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>
        ) : (
          <InvoiceDataTable data={invoices || []} />
        )}
      </section>
    </div>
  );
}
