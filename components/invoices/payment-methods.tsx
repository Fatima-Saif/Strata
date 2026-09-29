'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPaymentMethods, removePaymentMethod, setDefaultPaymentMethod, addPaymentMethod } from '@/lib/api/invoices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, MoreHorizontal, Plus, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PaymentMethods() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeConfirm, setRemoveConfirm] = React.useState<string | null>(null);

  const { data: methods, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
  });

  const removeMutation = useMutation({
    mutationFn: removePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Payment method removed');
      setRemoveConfirm(null);
    }
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultPaymentMethod,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['payment-methods'] });
      const previous = queryClient.getQueryData(['payment-methods']);
      queryClient.setQueryData(['payment-methods'], (old: any) => {
        if (!old) return old;
        return old.map((m: any) => ({ ...m, isDefault: m.id === id }));
      });
      return { previous };
    },
    onSuccess: () => {
      toast.success('Default payment method updated');
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['payment-methods'], context?.previous);
      toast.error('Failed to update default method');
    }
  });

  const addMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Payment method added');
      setAddOpen(false);
    }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified mock adding
    addMutation.mutate({
      brand: 'mastercard',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiryMonth: '11',
      expiryYear: '2027',
      isDefault: false
    });
  };

  const attemptRemove = (id: string) => {
    if (methods?.length === 1) {
      toast.error('You cannot remove your only payment method.');
      return;
    }
    setRemoveConfirm(id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage the cards used for your subscription and invoices.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Card
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            {methods?.map((method) => (
              <div key={method.id} className={`flex items-center justify-between p-4 border rounded-lg ${method.isDefault ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 bg-background rounded flex items-center justify-center border border-border shadow-sm">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm capitalize">{method.brand} ending in {method.last4}</p>
                      {method.isDefault && <Badge variant="secondary" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-5 flex items-center bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Default</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Expires {method.expiryMonth}/{method.expiryYear}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!method.isDefault && (
                      <DropdownMenuItem onClick={() => defaultMutation.mutate(method.id)}>
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => attemptRemove(method.id)}
                    >
                      Remove Card
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details securely. (Mocked Form)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input placeholder="Name on card" required />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input placeholder="0000 0000 0000 0000" maxLength={19} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input placeholder="MM/YY" maxLength={5} required />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input placeholder="123" maxLength={4} type="password" required />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Card
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!removeConfirm} onOpenChange={(open) => !open && setRemoveConfirm(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Remove Payment Method
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this card? Any ongoing subscriptions using this card will need to be updated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setRemoveConfirm(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              disabled={removeMutation.isPending}
              onClick={() => removeConfirm && removeMutation.mutate(removeConfirm)}
            >
              {removeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
