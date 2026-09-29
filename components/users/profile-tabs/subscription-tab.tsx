'use client';

import * as React from 'react';
import { User, updateUser } from '@/lib/api/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
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

const PLAN_FEATURES = {
  Free: ['Up to 100 users', 'Basic analytics', 'Community support'],
  Pro: ['Up to 10,000 users', 'Advanced analytics', 'Priority email support', 'Custom domains'],
  Enterprise: ['Unlimited users', 'Custom reporting', '24/7 phone support', 'SLA guarantees', 'Dedicated account manager'],
};

export function SubscriptionTab({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = React.useState<{ open: boolean, plan: User['plan'] | null }>({ open: false, plan: null });

  const mutation = useMutation({
    mutationFn: (newPlan: User['plan']) => updateUser(user.id, { plan: newPlan }),
    onSuccess: (data) => {
      toast.success(`Successfully updated plan to ${data.plan}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmDialog({ open: false, plan: null });
    },
    onError: () => {
      toast.error('Failed to update plan');
      setConfirmDialog({ open: false, plan: null });
    }
  });

  const handleAction = (plan: User['plan']) => {
    setConfirmDialog({ open: true, plan });
  };

  const executeChange = () => {
    if (confirmDialog.plan) {
      mutation.mutate(confirmDialog.plan);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-primary/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Current Plan
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-3xl">{user.plan}</CardTitle>
          <CardDescription>
            {user.plan === 'Free' ? 'Basic tier for exploring the product.' :
             user.plan === 'Pro' ? 'The most popular choice for growing businesses.' :
             'Maximum performance and support for large organizations.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mt-4">
            {PLAN_FEATURES[user.plan].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-6 mt-4 border-t border-border flex flex-wrap gap-4">
          {user.plan !== 'Enterprise' && (
            <Button className="w-full sm:w-auto" onClick={() => handleAction(user.plan === 'Free' ? 'Pro' : 'Enterprise')}>
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Upgrade to {user.plan === 'Free' ? 'Pro' : 'Enterprise'}
            </Button>
          )}
          {user.plan !== 'Free' && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleAction(user.plan === 'Enterprise' ? 'Pro' : 'Free')}>
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Downgrade to {user.plan === 'Enterprise' ? 'Pro' : 'Free'}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, plan: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              You are about to change the subscription plan for {user.name} from <strong>{user.plan}</strong> to <strong>{confirmDialog.plan}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Prorated Cost (Mocked)</span>
              <span className="text-lg font-bold">
                {confirmDialog.plan === 'Enterprise' ? '$999.00' : confirmDialog.plan === 'Pro' ? '$49.00' : '$0.00'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              This action will take effect immediately and the customer will be invoiced for the prorated amount on their next billing cycle.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, plan: null })}>Cancel</Button>
            <Button onClick={executeChange} disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
