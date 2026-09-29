'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPlans, fetchTenantUsage, PlanTier } from '@/lib/api/subscriptions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, HardDrive, Users, Activity } from 'lucide-react';
import { PlanUpgradeDialog } from './plan-upgrade-dialog';

export function PricingGrid() {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanTier | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: fetchPlans,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['tenant-usage'],
    queryFn: fetchTenantUsage,
  });

  if (plansLoading || usageLoading) {
    return <div className="flex justify-center p-24"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>;
  }

  if (!plans || !usage) return null;

  const currentPlanIndex = plans.findIndex(p => p.name === usage.currentPlan);
  const currentPlan = plans[currentPlanIndex];

  const handleActionClick = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {plans.map((plan, index) => {
          const isCurrent = plan.name === usage.currentPlan;
          const isDowngrade = index < currentPlanIndex;
          
          return (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${plan.popular ? 'border-primary shadow-md scale-[1.02] md:scale-105 z-10' : 'border-border'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-border">
                    Current Plan
                  </span>
                </div>
              )}
              
              <CardHeader className="pt-8 pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px] mt-2">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  ${plan.price}
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-4">
                <div className="space-y-4 mb-6 pt-4 border-t border-border">
                  <div className="flex items-center text-sm">
                    <HardDrive className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <span><strong>{plan.limits.storageGb}GB</strong> Storage</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <span><strong>{plan.limits.members}</strong> Members</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                    <span><strong>{plan.limits.apiRequests.toLocaleString()}</strong> API requests</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground/90">Features included:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start text-sm">
                      <CheckCircle2 className={`h-4 w-4 mr-2 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-emerald-500'}`} />
                      <span className="text-muted-foreground leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 mt-auto border-t border-border/50 bg-muted/20">
                <Button 
                  className="w-full" 
                  variant={isCurrent ? 'secondary' : (plan.popular ? 'default' : 'outline')}
                  disabled={isCurrent}
                  onClick={() => handleActionClick(plan)}
                >
                  {isCurrent ? 'Current Plan' : (isDowngrade ? 'Downgrade' : 'Upgrade')}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <PlanUpgradeDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        targetPlan={selectedPlan} 
        currentPlan={currentPlan}
      />
    </>
  );
}
