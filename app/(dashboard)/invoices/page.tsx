import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { InvoicesClient } from '@/components/invoices/invoices-client';

export default function InvoicesPage() {
  return (
    <PageTransition>
      <PageHeader 
        title="Billing & Invoices" 
        description="Manage your payment methods and view your billing history." 
      />
      <InvoicesClient />
    </PageTransition>
  );
}
