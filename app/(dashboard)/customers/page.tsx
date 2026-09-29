'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Search, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  Mail,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface CustomerAccount {
  id: string;
  name: string;
  domain: string;
  tier: 'Enterprise' | 'Scale' | 'Growth';
  seats: number;
  arr: number;
  healthScore: number;
  status: 'Active' | 'Onboarding' | 'At Risk';
  primaryContact: string;
  contactEmail: string;
  renewalDate: string;
}

const initialCustomers: CustomerAccount[] = [
  {
    id: 'cust-1',
    name: 'Vanguard Technologies Ltd',
    domain: 'vanguardtech.io',
    tier: 'Enterprise',
    seats: 450,
    arr: 148000,
    healthScore: 98,
    status: 'Active',
    primaryContact: 'Marcus Vance',
    contactEmail: 'm.vance@vanguardtech.io',
    renewalDate: 'Nov 15, 2026',
  },
  {
    id: 'cust-2',
    name: 'Apex Digital Capital',
    domain: 'apexdigital.com',
    tier: 'Enterprise',
    seats: 320,
    arr: 96000,
    healthScore: 94,
    status: 'Active',
    primaryContact: 'Elena Rostova',
    contactEmail: 'e.rostova@apexdigital.com',
    renewalDate: 'Dec 01, 2026',
  },
  {
    id: 'cust-3',
    name: 'Nexus Cloud Infrastructure',
    domain: 'nexuscloud.net',
    tier: 'Scale',
    seats: 180,
    arr: 54000,
    healthScore: 82,
    status: 'Onboarding',
    primaryContact: 'Devin Thorne',
    contactEmail: 'thorne@nexuscloud.net',
    renewalDate: 'Jan 20, 2027',
  },
  {
    id: 'cust-4',
    name: 'Hyperion Bioanalytics',
    domain: 'hyperionbio.org',
    tier: 'Enterprise',
    seats: 620,
    arr: 210000,
    healthScore: 99,
    status: 'Active',
    primaryContact: 'Dr. Sarah Lin',
    contactEmail: 's.lin@hyperionbio.org',
    renewalDate: 'Oct 30, 2026',
  },
  {
    id: 'cust-5',
    name: 'Quantum Edge Robotics',
    domain: 'quantumedge.ai',
    tier: 'Scale',
    seats: 140,
    arr: 42000,
    healthScore: 68,
    status: 'At Risk',
    primaryContact: 'Tariq Mansour',
    contactEmail: 'tmansour@quantumedge.ai',
    renewalDate: 'Oct 12, 2026',
  },
  {
    id: 'cust-6',
    name: 'Cobalt Logistics Group',
    domain: 'cobaltlogistics.com',
    tier: 'Growth',
    seats: 75,
    arr: 22500,
    healthScore: 91,
    status: 'Active',
    primaryContact: 'Hannah Schmidt',
    contactEmail: 'hannah@cobaltlogistics.com',
    renewalDate: 'Feb 14, 2027',
  },
  {
    id: 'cust-7',
    name: 'Strata Security Partners',
    domain: 'stratasec.io',
    tier: 'Enterprise',
    seats: 290,
    arr: 87000,
    healthScore: 96,
    status: 'Active',
    primaryContact: 'David Sterling',
    contactEmail: 'david@stratasec.io',
    renewalDate: 'Mar 05, 2027',
  },
  {
    id: 'cust-8',
    name: 'Pulse Media Stream',
    domain: 'pulsemedia.tv',
    tier: 'Growth',
    seats: 60,
    arr: 18000,
    healthScore: 89,
    status: 'Active',
    primaryContact: 'Chloe Bennett',
    contactEmail: 'c.bennett@pulsemedia.tv',
    renewalDate: 'Apr 22, 2027',
  },
];

export default function CustomersPage() {
  const [search, setSearch] = React.useState('');
  const [filterTier, setFilterTier] = React.useState<'All' | 'Enterprise' | 'Scale' | 'Growth'>('All');

  const filtered = initialCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.domain.toLowerCase().includes(search.toLowerCase()) ||
                          c.primaryContact.toLowerCase().includes(search.toLowerCase());
    const matchesTier = filterTier === 'All' || c.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const handleExport = () => {
    toast.success('Customer directory exported!', {
      description: 'Downloaded active enterprise customer callset CSV.',
    });
  };

  const handleAddCustomer = () => {
    toast.info('New customer onboarding modal', {
      description: 'Direct your prospect to the invitation portal.',
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Customer Accounts" 
          description="Manage client organizations, contract valuations, health scores, and key account stakeholders."
          action={
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddCustomer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-medium shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Organization
              </Button>
            </div>
          }
        />

        {/* Top KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Client Orgs"
            value={184}
            trend="up"
            trendValue="+8.5%"
            icon={<Building2 className="w-4 h-4" />}
          />
          <StatCard
            title="Enterprise Contract ARR"
            value={2.84}
            prefix="$"
            suffix="M"
            trend="up"
            trendValue="+19.2%"
            icon={<DollarSign className="w-4 h-4" />}
          />
          <StatCard
            title="Avg. Contract Value (ACV)"
            value={34800}
            prefix="$"
            trend="up"
            trendValue="+6.4%"
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            title="Account Health Average"
            value={94.2}
            suffix="%"
            trend="up"
            trendValue="+1.8%"
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies, domains, contacts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full bg-muted/40 border-border"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['All', 'Enterprise', 'Scale', 'Growth'] as const).map(tier => (
              <Button
                key={tier}
                size="sm"
                variant={filterTier === tier ? 'default' : 'secondary'}
                onClick={() => setFilterTier(tier)}
                className="text-xs h-8 cursor-pointer"
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>

        {/* Customers Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Organization</th>
                  <th className="px-4 py-3.5">Tier</th>
                  <th className="px-4 py-3.5">Seats</th>
                  <th className="px-4 py-3.5">ARR Value</th>
                  <th className="px-4 py-3.5">Health</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Primary Contact</th>
                  <th className="px-4 py-3.5">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(cust => (
                  <tr key={cust.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {cust.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{cust.name}</p>
                          <p className="text-xs text-muted-foreground">{cust.domain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={
                        cust.tier === 'Enterprise' ? 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5' :
                        cust.tier === 'Scale' ? 'border-sky-500/40 text-sky-600 bg-sky-500/5' :
                        'border-zinc-500/40 text-zinc-600 bg-zinc-500/5'
                      }>
                        {cust.tier}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">{cust.seats} seats</td>
                    <td className="px-4 py-4 font-semibold font-mono">${(cust.arr).toLocaleString()}/yr</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              cust.healthScore >= 90 ? 'bg-emerald-500' :
                              cust.healthScore >= 75 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${cust.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium font-mono">{cust.healthScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={
                        cust.status === 'Active' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' :
                        cust.status === 'Onboarding' ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/20' :
                        'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20'
                      }>
                        {cust.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground text-xs">{cust.primaryContact}</p>
                      <a href={`mailto:${cust.contactEmail}`} className="text-[11px] text-muted-foreground hover:underline flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {cust.contactEmail}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {cust.renewalDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
