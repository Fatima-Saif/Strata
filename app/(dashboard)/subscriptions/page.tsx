import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { UsageIndicators } from '@/components/subscriptions/usage-indicators';
import { PricingGrid } from '@/components/subscriptions/pricing-grid';

export default function SubscriptionsPage() {
  return (
    <PageTransition>
      <PageHeader 
        title="Subscriptions & Billing" 
        description="Manage your workspace plan, view current usage, and update your billing preferences." 
      />
      <div className="space-y-10 pb-10">
        <section>
          <UsageIndicators />
        </section>
        
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose the perfect plan for your team's needs. Upgrade or downgrade at any time.
            </p>
          </div>
          <PricingGrid />
        </section>
      </div>
    </PageTransition>
  );
}
