'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Invoice, processRefund } from '@/lib/api/invoices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RefundDialog({ 
  invoice, 
  open, 
  onOpenChange 
}: { 
  invoice: Invoice | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const refundSchema = z.object({
    amount: z.number()
      .min(0.01, 'Refund amount must be greater than 0')
      .max(invoice?.amount || 0, 'Refund cannot exceed the original invoice amount'),
    reason: z.string().min(1, 'Please select a reason'),
    notes: z.string().optional(),
  });

  type RefundFormValues = z.infer<typeof refundSchema>;

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: invoice?.amount,
      reason: '',
      notes: '',
    }
  });

  const watchAmount = watch('amount');

  React.useEffect(() => {
    if (open && invoice) {
      reset({
        amount: invoice.amount,
        reason: '',
        notes: '',
      });
    }
  }, [open, invoice, reset]);

  const mutation = useMutation({
    mutationFn: (data: RefundFormValues) => processRefund(invoice!.id, data.amount, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Refund processed successfully');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to process refund. Please try again.');
    }
  });

  const onSubmit = (data: RefundFormValues) => {
    mutation.mutate(data);
  };

  if (!invoice) return null;

  const isFullRefund = watchAmount === invoice.amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Issue a full or partial refund for invoice <strong>{invoice.id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-md border border-border flex justify-between items-center">
            <span className="text-sm font-medium">Original Amount</span>
            <span className="text-lg font-bold">${invoice.amount.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Label>Refund Amount (USD)</Label>
            <Input 
              type="number" 
              step="0.01" 
              {...register('amount', { valueAsNumber: true })} 
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            <div className="flex gap-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setValue('amount', invoice.amount, { shouldValidate: true })}
              >
                Full Refund
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setValue('amount', Number((invoice.amount / 2).toFixed(2)), { shouldValidate: true })}
              >
                50% Partial
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Select onValueChange={(val: string | null) => setValue('reason', val || '', { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duplicate">Duplicate charge</SelectItem>
                <SelectItem value="fraudulent">Fraudulent</SelectItem>
                <SelectItem value="requested_by_customer">Requested by customer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea 
              placeholder="Internal notes about this refund..." 
              {...register('notes')} 
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3 rounded-md text-xs font-medium flex items-start gap-2 mt-4">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              This will return <strong>${Number(watchAmount || 0).toFixed(2)}</strong> to the customer's original payment method. 
              This action cannot be undone.
            </span>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFullRefund ? 'Issue Full Refund' : 'Issue Partial Refund'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
