'use client';

import * as React from 'react';
import { PlanTier, PlanName, updateTenantPlan } from '@/lib/api/subscriptions';
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
import { Loader2, AlertTriangle, CheckCircle2, CreditCard } from 'lucide-react';

interface PlanUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPlan: PlanTier | null;
  currentPlan: PlanTier | null;
}

export function PlanUpgradeDialog({ open, onOpenChange, targetPlan, currentPlan }: PlanUpgradeDialogProps) {
  const [step, setStep] = React.useState<'confirm' | 'payment' | 'warning' | 'success'>('confirm');
  const queryClient = useQueryClient();

  const isDowngrade = targetPlan && currentPlan && targetPlan.price < currentPlan.price;

  // Reset step when dialog opens with a new plan
  React.useEffect(() => {
    if (open && targetPlan) {
      setStep(isDowngrade ? 'warning' : 'confirm');
    }
  }, [open, targetPlan, isDowngrade]);

  const mutation = useMutation({
    mutationFn: (planName: PlanName) => updateTenantPlan(planName),
    onSuccess: (data) => {
      queryClient.setQueryData(['tenant-usage'], data);
      setStep('success');
      toast.success(`Successfully switched to the ${data.currentPlan} plan.`);
    },
    onError: () => {
      toast.error('Failed to change subscription plan. Please try again.');
      onOpenChange(false);
    }
  });

  const handleNext = () => {
    if (step === 'warning') setStep('confirm');
    else if (step === 'confirm' && !isDowngrade) setStep('payment');
    else if (step === 'confirm' && isDowngrade) handleConfirm();
    else if (step === 'payment') handleConfirm();
    else if (step === 'success') onOpenChange(false);
  };

  const handleConfirm = () => {
    if (targetPlan) {
      mutation.mutate(targetPlan.name);
    }
  };

  if (!targetPlan || !currentPlan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'warning' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Downgrade Warning
              </DialogTitle>
              <DialogDescription>
                You are about to downgrade from <strong>{currentPlan.name}</strong> to <strong>{targetPlan.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm">By downgrading, you will lose access to the following features immediately:</p>
              <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                {currentPlan.features.filter(f => !targetPlan.features.includes(f) && !f.startsWith('Everything in')).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
                {currentPlan.limits.storageGb > targetPlan.limits.storageGb && (
                  <li>Reduced storage capacity (from {currentPlan.limits.storageGb}GB to {targetPlan.limits.storageGb}GB)</li>
                )}
                {currentPlan.limits.members > targetPlan.limits.members && (
                  <li>Reduced team member limit (from {currentPlan.limits.members} to {targetPlan.limits.members})</li>
                )}
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3 rounded-md text-xs font-medium flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>If your current usage exceeds the limits of the {targetPlan.name} plan, some data or members may become temporarily inaccessible until you resolve the overages.</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleNext}>I Understand, Continue</Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Plan Change</DialogTitle>
              <DialogDescription>
                Review the changes to your subscription plan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Plan</p>
                  <p className="text-2xl font-bold">{targetPlan.name}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">Billing</p>
                  <p className="text-2xl font-bold">${targetPlan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </div>
              </div>
              
              {!isDowngrade && (
                <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium block">Prorated Cost Today</span>
                    <span className="text-xs text-muted-foreground">Calculated based on {new Date().getDate()} days remaining</span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ${Math.max(0, (targetPlan.price - currentPlan.price) * (30 - new Date().getDate()) / 30).toFixed(2)}
                  </span>
                </div>
              )}
              {isDowngrade && (
                <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium block">Account Credit</span>
                    <span className="text-xs text-muted-foreground">Prorated credit for the remaining month</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-500">
                    +${Math.max(0, (currentPlan.price - targetPlan.price) * (30 - new Date().getDate()) / 30).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleNext}>
                {isDowngrade ? 'Confirm Downgrade' : 'Continue to Payment'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle>Payment Method</DialogTitle>
              <DialogDescription>
                Confirm your payment details to complete the upgrade.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="border border-border rounded-lg p-4 flex items-center gap-4 bg-muted/30">
                <div className="h-10 w-16 bg-background rounded border border-border flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/28</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay & Upgrade
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl">Plan Updated!</DialogTitle>
              <DialogDescription className="text-base">
                Your workspace has been successfully {isDowngrade ? 'downgraded' : 'upgraded'} to the <strong>{targetPlan.name}</strong> plan.
              </DialogDescription>
              <p className="text-sm text-muted-foreground">
                Your new limits are now active. A receipt has been sent to your email.
              </p>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => onOpenChange(false)}>Return to Subscriptions</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
