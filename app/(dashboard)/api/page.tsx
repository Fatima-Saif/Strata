import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { ApiKpiCards } from '@/components/api-usage/api-kpi-cards';
import { ApiUsageChart } from '@/components/api-usage/api-usage-chart';
import { RateLimitPanel } from '@/components/api-usage/rate-limit-panel';
import { TopEndpointsTable } from '@/components/api-usage/top-endpoints-table';
import { ApiKeyManager } from '@/components/api-usage/api-key-manager';

export default function ApiPage() {
  return (
    <PageTransition>
      <PageHeader 
        title="API & Developers" 
        description="Monitor your API usage, view top endpoints, and manage your API keys." 
      />
      <div className="space-y-6 pb-10">
        <ApiKpiCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ApiUsageChart />
          </div>
          <div>
            <RateLimitPanel />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopEndpointsTable />
          <ApiKeyManager />
        </div>
      </div>
    </PageTransition>
  );
}
