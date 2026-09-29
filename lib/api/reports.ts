import { faker } from '@faker-js/faker';

export interface RevenueReportPeriod {
  period: string;
  revenue: number;
  expenses: number;
  profitMargin: number;
  isPartial: boolean;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface ForecastDataPoint {
  date: string;
  historical: number | null;
  forecast: number | null;
  upper: number | null;
  lower: number | null;
}

faker.seed(987);

const generateReportPeriods = (count: number, type: 'month' | 'quarter' | 'year'): RevenueReportPeriod[] => {
  return Array.from({ length: count }).map((_, i) => {
    const isCurrent = i === count - 1;
    const baseRevenue = type === 'month' ? 40000 : type === 'quarter' ? 120000 : 480000;
    const growth = 1 + (i * 0.05); // 5% growth per period
    
    // Partial period calculation
    const multiplier = isCurrent ? 0.7 : 1; 
    
    const revenue = Math.floor(baseRevenue * growth * multiplier + faker.number.int({ min: -5000, max: 5000 }));
    const expenses = Math.floor(revenue * faker.number.float({ min: 0.3, max: 0.5 }));
    const profitMargin = ((revenue - expenses) / revenue) * 100;

    let periodLabel = '';
    const date = new Date();
    if (type === 'month') {
      date.setMonth(date.getMonth() - (count - 1 - i));
      periodLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    } else if (type === 'quarter') {
      const q = Math.floor((date.getMonth() - (count - 1 - i) * 3) / 3) + 1;
      periodLabel = `Q${q > 0 ? q : q + 4} ${date.getFullYear() - (q <= 0 ? 1 : 0)}`;
    } else {
      periodLabel = `${date.getFullYear() - (count - 1 - i)}`;
    }

    return {
      period: periodLabel,
      revenue,
      expenses,
      profitMargin,
      isPartial: isCurrent,
    };
  });
};

export const mockMonthlyReports = generateReportPeriods(12, 'month');
export const mockQuarterlyReports = generateReportPeriods(8, 'quarter');
export const mockAnnualReports = generateReportPeriods(5, 'year');

export const mockExpenseCategories: ExpenseCategory[] = [
  { name: 'Payroll', value: 45000, color: 'hsl(var(--chart-1))' },
  { name: 'Infrastructure', value: 18000, color: 'hsl(var(--chart-2))' },
  { name: 'Marketing', value: 12000, color: 'hsl(var(--chart-3))' },
  { name: 'Software', value: 5000, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 3000, color: 'hsl(var(--chart-5))' },
];

export const generateForecast = (): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  let currentRev = 45000;
  
  // 6 months historical
  for(let i=6; i>0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    currentRev = currentRev * 1.05 + faker.number.int({ min: -2000, max: 2000 });
    data.push({
      date: d.toLocaleString('default', { month: 'short' }),
      historical: currentRev,
      forecast: null,
      upper: null,
      lower: null
    });
  }
  
  // Current month (connector)
  const currentD = new Date();
  data.push({
    date: currentD.toLocaleString('default', { month: 'short' }),
    historical: currentRev,
    forecast: currentRev,
    upper: currentRev,
    lower: currentRev,
  });
  
  // 6 months forecast
  for(let i=1; i<=6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const growth = 1.05;
    currentRev = currentRev * growth;
    
    // Confidence band widens over time
    const variance = currentRev * (0.02 * i);
    
    data.push({
      date: d.toLocaleString('default', { month: 'short' }),
      historical: null,
      forecast: currentRev,
      upper: currentRev + variance,
      lower: currentRev - variance,
    });
  }
  
  return data;
};


export async function fetchRevenueReports(type: 'month' | 'quarter' | 'year'): Promise<RevenueReportPeriod[]> {
  await new Promise(r => setTimeout(r, 400));
  if (type === 'month') return mockMonthlyReports;
  if (type === 'quarter') return mockQuarterlyReports;
  return mockAnnualReports;
}

export async function fetchExpenseBreakdown(): Promise<ExpenseCategory[]> {
  await new Promise(r => setTimeout(r, 300));
  return mockExpenseCategories;
}

export async function fetchRevenueForecast(): Promise<ForecastDataPoint[]> {
  await new Promise(r => setTimeout(r, 500));
  return generateForecast();
}
