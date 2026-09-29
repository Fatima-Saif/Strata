'use client';

import * as React from 'react';
import { Invoice } from '@/lib/api/invoices';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Clock, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function DisputeTracker({ 
  invoice, 
  open, 
  onOpenChange 
}: { 
  invoice: Invoice | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!invoice || !invoice.disputeStage) return null;

  const stages = ['Submitted', 'Under Review', 'Resolved'];
  const currentStageIndex = stages.indexOf(invoice.disputeStage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dispute Status</DialogTitle>
          <DialogDescription>
            Tracking the dispute lifecycle for invoice <strong>{invoice.id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-muted p-4 rounded-lg flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Disputed Amount</p>
              <p className="font-semibold text-lg">${invoice.amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Original Date</p>
              <p className="font-medium">{format(new Date(invoice.date), 'MMM d, yyyy')}</p>
            </div>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border -z-10" />
            
            <div className="space-y-8">
              {stages.map((stage, index) => {
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;
                
                return (
                  <div key={stage} className="flex gap-4 items-start relative bg-background">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2",
                      isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background text-muted-foreground"
                    )}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-muted-foreground" />}
                    </div>
                    
                    <div className="pt-1.5">
                      <h4 className={cn("text-sm font-semibold", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                        {stage}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {index === 0 && 'The customer bank has submitted a chargeback.'}
                        {index === 1 && 'Evidence is being reviewed by the card network.'}
                        {index === 2 && 'The dispute has been closed. Funds have been returned.'}
                      </p>
                      
                      {isCurrent && index === 1 && (
                        <div className="mt-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 p-3 rounded-md text-xs font-medium flex gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <div>Action Required: You have 3 days to submit evidence to contest this dispute.</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
