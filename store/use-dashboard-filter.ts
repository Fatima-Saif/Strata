import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface DashboardFilterState {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  comparePrevious: boolean;
  setComparePrevious: (compare: boolean) => void;
}

export const useDashboardFilter = create<DashboardFilterState>()(
  persist(
    (set) => ({
      dateRange: 'month',
      setDateRange: (range) => set({ dateRange: range }),
      comparePrevious: true,
      setComparePrevious: (compare) => set({ comparePrevious: compare }),
    }),
    {
      name: 'dashboard-filter-storage',
    }
  )
);
