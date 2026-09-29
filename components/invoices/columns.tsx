'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from '@/lib/api/invoices';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, MoreHorizontal, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { RefundDialog } from './refund-dialog';
import { DisputeTracker } from './dispute-tracker';

export const InvoiceStatusBadge = ({ status }: { status: Invoice['status'] }) => {
  switch (status) {
    case 'Paid':
      return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25">Paid</Badge>;
    case 'Pending':
      return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/25">Pending</Badge>;
    case 'Refunded':
      return <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/20 hover:bg-purple-500/25">Refunded</Badge>;
    case 'Failed':
      return <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/25">Failed</Badge>;
    case 'Cancelled':
      return <Badge variant="secondary" className="text-muted-foreground">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// We use a custom hook-like component wrapper for the columns to manage dialog state inside the table
export const useInvoiceColumns = () => {
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [refundOpen, setRefundOpen] = React.useState(false);
  const [disputeOpen, setDisputeOpen] = React.useState(false);

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice Number',
      cell: ({ row }) => <div className="font-mono text-sm font-medium">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{invoice.customerName}</span>
            <span className="text-xs text-muted-foreground">{invoice.customerEmail}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{format(new Date(row.getValue('date')), 'MMM d, yyyy')}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <InvoiceStatusBadge status={invoice.status} />
            {invoice.disputeStage && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer" onClick={() => {
                setSelectedInvoice(invoice);
                setDisputeOpen(true);
              }}>
                <AlertCircle className="h-3 w-3 mr-1" /> Disputed
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const invoice = row.original;
        const canRefund = invoice.status === 'Paid';
        
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  disabled={!canRefund}
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setRefundOpen(true);
                  }}
                >
                  Issue Refund
                </DropdownMenuItem>
                {invoice.disputeStage && (
                  <DropdownMenuItem onClick={() => {
                    setSelectedInvoice(invoice);
                    setDisputeOpen(true);
                  }}>
                    View Dispute
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return { columns, selectedInvoice, refundOpen, setRefundOpen, disputeOpen, setDisputeOpen };
};
