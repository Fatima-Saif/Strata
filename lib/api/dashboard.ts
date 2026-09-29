import { DateRange } from "@/store/use-dashboard-filter";

export interface KPIData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  sparklineData?: { value: number }[];
}

export interface DashboardData {
  primary: {
    revenue: KPIData;
    activeUsers: KPIData;
    mrr: KPIData;
    churn: KPIData;
  };
  secondary: {
    conversionRate: KPIData;
    clv: KPIData;
    netProfit: KPIData;
    arpu: KPIData;
  };
}

// Generate deterministic random mock data based on a seed
function pseudoRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const generateSparkline = (base: number, volatility: number, prng: () => number) => {
  return Array.from({ length: 14 }).map(() => ({
    value: base + (prng() * volatility - volatility / 2),
  }));
};

export async function fetchDashboardData(dateRange: DateRange, comparePrevious: boolean): Promise<DashboardData> {
  // Simulate network delay of 800ms to properly show skeletons
  await new Promise(resolve => setTimeout(resolve, 800));

  // Base seed on dateRange so switching filters changes the data
  const seed = dateRange === 'today' ? 1 
             : dateRange === 'week' ? 2 
             : dateRange === 'month' ? 3 
             : dateRange === 'quarter' ? 4 
             : 5;
             
  const prng = pseudoRandom(seed);

  // Simulated failure logic removed to prevent permanent blockers on certain seeds

  // Multipliers based on date range
  const m = dateRange === 'today' ? 0.03
          : dateRange === 'week' ? 0.25
          : dateRange === 'month' ? 1
          : dateRange === 'quarter' ? 3
          : 12;

  const compareMultiplier = comparePrevious ? 1 : 0.8;

  return {
    primary: {
      revenue: {
        title: "Total Revenue",
        value: 248950 * m * compareMultiplier,
        prefix: "$",
        trend: "up",
        trendValue: "+12.4%",
        sparklineData: generateSparkline(20000 * m, 5000 * m, prng),
      },
      activeUsers: {
        title: "Active Users",
        value: Math.floor(15842 * m * compareMultiplier),
        trend: "up",
        trendValue: `+${Math.floor(632 * m)} today`,
        sparklineData: generateSparkline(1000 * m, 200 * m, prng),
      },
      mrr: {
        title: "Monthly Recurring Revenue",
        value: 86420 * m * compareMultiplier,
        prefix: "$",
        trend: "up",
        trendValue: "+18%",
        sparklineData: generateSparkline(80000 * m, 2000 * m, prng),
      },
      churn: {
        title: "Churn Rate",
        value: 2.1,
        suffix: "%",
        trend: "down",
        trendValue: "-0.4%",
        sparklineData: generateSparkline(2.1, 0.5, prng),
      }
    },
    secondary: {
      conversionRate: {
        title: "Conversion Rate",
        value: 8.6,
        suffix: "%",
        trend: "up",
        trendValue: "+1.2%",
      },
      clv: {
        title: "Customer Lifetime Value",
        value: 4850 * compareMultiplier,
        prefix: "$",
        trend: "up",
        trendValue: "+$120",
      },
      netProfit: {
        title: "Net Profit",
        value: 138000 * m * compareMultiplier,
        prefix: "$",
        trend: "up",
        trendValue: "+14%",
      },
      arpu: {
        title: "Average Revenue Per User",
        value: 126 * compareMultiplier,
        prefix: "$",
        trend: "neutral",
        trendValue: "0%",
      }
    }
  };
}
