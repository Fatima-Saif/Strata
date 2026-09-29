import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

export type ReportType = 'Revenue' | 'Users' | 'Subscriptions' | 'Security' | 'Custom';
export type RecurrenceFreq = 'Daily' | 'Weekly' | 'Monthly';

export interface ReportConfig {
  type: ReportType;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[]; // e.g. "Total Revenue", "New Signups", etc.
}

export interface ScheduledReport {
  id: string;
  title: string;
  config: ReportConfig;
  frequency: RecurrenceFreq;
  recipients: string[]; // array of emails
  nextRunDate: string;
  status: 'Active' | 'Paused';
}

interface ReportEngineState {
  // Builder state
  currentConfig: ReportConfig;
  setConfig: (updates: Partial<ReportConfig>) => void;

  // Scheduled reports state
  scheduledReports: ScheduledReport[];
  scheduleReport: (report: Omit<ScheduledReport, 'id' | 'nextRunDate' | 'status'>) => void;
  pauseSchedule: (id: string) => void;
  resumeSchedule: (id: string) => void;
  deleteSchedule: (id: string) => void;
}

const computeNextRun = (frequency: RecurrenceFreq): string => {
  const d = new Date();
  if (frequency === 'Daily') d.setDate(d.getDate() + 1);
  if (frequency === 'Weekly') d.setDate(d.getDate() + 7);
  if (frequency === 'Monthly') d.setMonth(d.getMonth() + 1);
  return d.toISOString();
};

faker.seed(987);
const initialSchedules: ScheduledReport[] = [
  {
    id: faker.string.uuid(),
    title: 'Weekly Revenue Exec Summary',
    config: {
      type: 'Revenue',
      dateRange: { start: new Date(Date.now() - 7 * 86400000).toISOString(), end: new Date().toISOString() },
      metrics: ['Total Revenue', 'Profit Margin']
    },
    frequency: 'Weekly',
    recipients: ['ceo@example.com', 'cfo@example.com'],
    nextRunDate: computeNextRun('Weekly'),
    status: 'Active'
  },
  {
    id: faker.string.uuid(),
    title: 'Monthly Churn Alert',
    config: {
      type: 'Subscriptions',
      dateRange: { start: new Date(Date.now() - 30 * 86400000).toISOString(), end: new Date().toISOString() },
      metrics: ['Churn Rate']
    },
    frequency: 'Monthly',
    recipients: ['retention@example.com'],
    nextRunDate: computeNextRun('Monthly'),
    status: 'Paused'
  }
];

export const useReportEngineStore = create<ReportEngineState>()(
  persist(
    (set) => ({
      currentConfig: {
        type: 'Revenue',
        dateRange: {
          start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
          end: new Date().toISOString()
        },
        metrics: ['Total Revenue']
      },
      
      setConfig: (updates) => set((state) => ({
        currentConfig: { ...state.currentConfig, ...updates }
      })),

      scheduledReports: initialSchedules,

      scheduleReport: (report) => set((state) => ({
        scheduledReports: [
          ...state.scheduledReports,
          {
            ...report,
            id: Math.random().toString(),
            nextRunDate: computeNextRun(report.frequency),
            status: 'Active'
          }
        ]
      })),

      pauseSchedule: (id) => set((state) => ({
        scheduledReports: state.scheduledReports.map(r => r.id === id ? { ...r, status: 'Paused' } : r)
      })),

      resumeSchedule: (id) => set((state) => ({
        scheduledReports: state.scheduledReports.map(r => r.id === id ? { ...r, status: 'Active', nextRunDate: computeNextRun(r.frequency) } : r)
      })),

      deleteSchedule: (id) => set((state) => ({
        scheduledReports: state.scheduledReports.filter(r => r.id !== id)
      })),
    }),
    {
      name: 'report-engine-store'
    }
  )
);
