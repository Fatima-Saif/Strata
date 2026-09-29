import { DateRange } from "@/store/use-dashboard-filter";

export interface RevenueDataPoint {
  date: string;
  current: number;
  previous: number;
}

export interface SubscriptionDataPoint {
  month: string;
  free: number;
  starter: number;
  pro: number;
  enterprise: number;
}

export interface RevenueSource {
  name: string;
  value: number;
  fill: string;
}

export interface GrowthComparisonPoint {
  date: string;
  revenue: { current: number; previous: number };
  users: { current: number; previous: number };
  churn: { current: number; previous: number };
}

export interface CohortRow {
  cohort: string;
  users: number;
  m0: number;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
}

// Generate deterministic mock data based on a seed
function pseudoRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export async function fetchRevenueChartData(dateRange: DateRange, comparePrevious: boolean): Promise<RevenueDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
  
  const seed = dateRange === 'today' ? 10 : dateRange === 'week' ? 20 : dateRange === 'month' ? 30 : dateRange === 'quarter' ? 40 : 50;
  const prng = pseudoRandom(seed);
  
  const length = dateRange === 'today' ? 24 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : dateRange === 'quarter' ? 12 : 12;
  const baseValue = dateRange === 'today' ? 1000 : dateRange === 'week' ? 5000 : dateRange === 'month' ? 8000 : 25000;
  
  return Array.from({ length }).map((_, i) => {
    let dateStr = '';
    if (dateRange === 'today') dateStr = `${i}:00`;
    else if (dateRange === 'week') dateStr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
    else if (dateRange === 'month') dateStr = `Day ${i + 1}`;
    else if (dateRange === 'quarter') dateStr = `Week ${i + 1}`;
    else dateStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
    
    return {
      date: dateStr,
      current: Math.floor(baseValue + (prng() * baseValue * 0.5)),
      previous: comparePrevious ? Math.floor(baseValue * 0.8 + (prng() * baseValue * 0.4)) : 0,
    };
  });
}

export async function fetchSubscriptionChartData(dateRange: DateRange): Promise<SubscriptionDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const seed = dateRange === 'today' ? 100 : dateRange === 'week' ? 200 : dateRange === 'month' ? 300 : dateRange === 'quarter' ? 400 : 500;
  const prng = pseudoRandom(seed);
  
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  
  let free = 400;
  let starter = 150;
  let pro = 50;
  let enterprise = 5;
  
  return months.map(month => {
    free += Math.floor(prng() * 50 - 10);
    starter += Math.floor(prng() * 20 - 2);
    pro += Math.floor(prng() * 10 - 1);
    enterprise += Math.floor(prng() * 2);
    
    if (month === 'Sep' && dateRange === 'month') {
      enterprise = 0;
    }
    
    return {
      month,
      free,
      starter,
      pro,
      enterprise,
    };
  });
}

export async function fetchRevenueSourcesData(dateRange: DateRange): Promise<RevenueSource[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const seed = dateRange === 'today' ? 1000 : dateRange === 'week' ? 2000 : dateRange === 'month' ? 3000 : dateRange === 'quarter' ? 4000 : 5000;
  const prng = pseudoRandom(seed);
  
  return [
    { name: 'Organic Search', value: 35 + Math.floor(prng() * 10 - 5), fill: 'hsl(var(--chart-1))' },
    { name: 'Direct Traffic', value: 25 + Math.floor(prng() * 10 - 5), fill: 'hsl(var(--chart-2))' },
    { name: 'Social Media', value: 20 + Math.floor(prng() * 10 - 5), fill: 'hsl(var(--chart-3))' },
    { name: 'Paid Ads', value: 15 + Math.floor(prng() * 10 - 5), fill: 'hsl(var(--chart-4))' },
    { name: 'Referral', value: 5 + Math.floor(prng() * 5 - 2), fill: 'hsl(var(--chart-5))' },
  ];
}

export async function fetchGrowthComparisonData(period: 'month' | 'year'): Promise<GrowthComparisonPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const prng = pseudoRandom(period === 'month' ? 10000 : 20000);
  const length = period === 'month' ? 30 : 12;
  
  return Array.from({ length }).map((_, i) => {
    let dateStr = period === 'month' ? `Day ${i + 1}` : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
    
    const revBase = period === 'month' ? 5000 : 100000;
    const usrBase = period === 'month' ? 100 : 2000;
    
    return {
      date: dateStr,
      revenue: {
        current: Math.floor(revBase + (prng() * revBase * 0.3)),
        previous: Math.floor(revBase * 0.8 + (prng() * revBase * 0.2)),
      },
      users: {
        current: Math.floor(usrBase + (prng() * usrBase * 0.4)),
        previous: Math.floor(usrBase * 0.7 + (prng() * usrBase * 0.3)),
      },
      churn: {
        current: 2.1 + (prng() * 1.5 - 0.5),
        previous: 2.5 + (prng() * 1.0 - 0.2),
      }
    };
  });
}

export async function fetchRetentionCohortData(): Promise<CohortRow[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const months = ['Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'];
  const prng = pseudoRandom(42);
  
  return months.map((cohort, index) => {
    const users = Math.floor(1000 + prng() * 500);
    // Retention degrades over time
    const decay = 0.85 + (prng() * 0.05); // Between 85% and 90% retained each month
    
    const row: any = { cohort, users, m0: 100 };
    let currentRet = 100;
    
    for (let m = 1; m <= 6; m++) {
      // If the month hasn't happened yet (e.g. Dec cohort in month 3), return null
      if (index + m > 5) {
        row[`m${m}`] = null;
      } else {
        currentRet = currentRet * decay;
        row[`m${m}`] = Math.max(10, Math.floor(currentRet)); // Minimum 10%
      }
    }
    return row as CohortRow;
  });
}

// --- PHASE 8 ADVANCED VISUALIZATIONS ---

export interface HeatmapDataPoint {
  date: Date;
  level: number; // 0 to 4
  login: number;
  session: number;
  purchase: number;
}

export async function fetchActivityHeatmapData(): Promise<HeatmapDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const prng = pseudoRandom(12345);
  const data: HeatmapDataPoint[] = [];
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Generate a cyclical pattern (higher in middle of week, higher in certain months)
    const dayOfWeek = d.getDay();
    const month = d.getMonth();
    
    // Weekend dip
    const weekendMult = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.3 : 1;
    // Seasonal peak (e.g., Q4)
    const seasonalMult = (month >= 9 && month <= 11) ? 1.5 : 1.0;
    
    const baseVal = prng() * 10 * weekendMult * seasonalMult;
    
    let level = 0;
    if (baseVal > 8) level = 4;
    else if (baseVal > 5) level = 3;
    else if (baseVal > 2) level = 2;
    else if (baseVal > 0.5) level = 1;
    
    data.push({
      date: new Date(d),
      level,
      login: Math.floor(baseVal * 50),
      session: Math.floor(baseVal * 40),
      purchase: Math.floor(baseVal * 5),
    });
  }
  
  return data;
}

export interface CountryDataPoint {
  id: string; // ISO3
  name: string;
  value: number;
  growth: number;
}

export async function fetchCountryDistributionData(metric: 'revenue' | 'users'): Promise<CountryDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const prng = pseudoRandom(metric === 'revenue' ? 100 : 200);
  
  const countries = [
    { id: 'USA', name: 'United States' },
    { id: 'GBR', name: 'United Kingdom' },
    { id: 'CAN', name: 'Canada' },
    { id: 'AUS', name: 'Australia' },
    { id: 'DEU', name: 'Germany' },
    { id: 'FRA', name: 'France' },
    { id: 'JPN', name: 'Japan' },
    { id: 'IND', name: 'India' },
    { id: 'BRA', name: 'Brazil' },
    { id: 'MEX', name: 'Mexico' }
  ];
  
  const baseScale = metric === 'revenue' ? 100000 : 5000;
  
  return countries.map((c, i) => {
    // Arbitrary distribution curve
    const value = Math.floor(baseScale * (10 - i) / 10 * (0.8 + prng() * 0.4));
    const growth = (prng() * 30) - 5; // -5% to +25%
    return { ...c, value, growth };
  });
}

export interface FunnelDataPoint {
  stage: string;
  count: number;
}

export async function fetchFunnelData(): Promise<FunnelDataPoint[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { stage: 'Visitors', count: 125000 },
    { stage: 'Signups', count: 25000 },
    { stage: 'Trials', count: 12000 },
    { stage: 'Paid', count: 4500 },
    { stage: 'Enterprise', count: 250 },
  ];
}

export interface SystemAnalyticsData {
  devices: { name: string; value: number; fill: string }[];
  browsers: { name: string; value: number; fill: string }[];
  os: { name: string; value: number; fill: string }[];
}

export async function fetchSystemAnalyticsData(): Promise<SystemAnalyticsData> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    devices: [
      { name: 'Desktop', value: 65, fill: 'hsl(var(--chart-1))' },
      { name: 'Mobile', value: 28, fill: 'hsl(var(--chart-2))' },
      { name: 'Tablet', value: 7, fill: 'hsl(var(--chart-3))' },
    ],
    browsers: [
      { name: 'Chrome', value: 55, fill: 'hsl(var(--chart-1))' },
      { name: 'Safari', value: 25, fill: 'hsl(var(--chart-2))' },
      { name: 'Firefox', value: 10, fill: 'hsl(var(--chart-3))' },
      { name: 'Edge', value: 7, fill: 'hsl(var(--chart-4))' },
      { name: 'Opera', value: 3, fill: 'hsl(var(--chart-5))' },
    ],
    os: [
      { name: 'Windows', value: 45, fill: 'hsl(var(--chart-1))' },
      { name: 'macOS', value: 35, fill: 'hsl(var(--chart-2))' },
      { name: 'iOS', value: 12, fill: 'hsl(var(--chart-3))' },
      { name: 'Android', value: 5, fill: 'hsl(var(--chart-4))' },
      { name: 'Linux', value: 3, fill: 'hsl(var(--chart-5))' },
    ]
  };
}
