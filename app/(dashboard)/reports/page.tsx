import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevenueSummaryReports } from '@/components/reports/revenue-summary-reports';
import { ExpenseBreakdown } from '@/components/reports/expense-breakdown';
import { TaxSummaryCard } from '@/components/reports/tax-summary-card';
import { RevenueForecast } from '@/components/reports/revenue-forecast';
import { ReportBuilder } from '@/components/reports/report-builder';
import { ScheduledReports } from '@/components/reports/scheduled-reports';
import { BarChart, FileText, CalendarClock } from 'lucide-react';

export default function ReportsPage() {
  return (
    <PageTransition>
      <PageHeader 
        title="Reports & Analytics" 
        description="Build custom reports, view financials, and manage schedules." 
      />
      
      <Tabs defaultValue="financials" className="space-y-6 pb-10">
        <TabsList>
          <TabsTrigger value="financials" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Financials
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Report Builder
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" /> Scheduled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financials" className="mt-0 space-y-6">
          <RevenueSummaryReports />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseBreakdown />
            <TaxSummaryCard />
          </div>

          <div className="pt-4">
            <RevenueForecast />
          </div>
        </TabsContent>

        <TabsContent value="builder" className="mt-0">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-0">
          <ScheduledReports />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
