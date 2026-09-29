import { create } from 'zustand';
import { faker } from '@faker-js/faker';

export type EventType = 'meeting' | 'deadline' | 'task' | 'event';
export type EventSourceType = 'internal' | 'google';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: string;
  end: string;
  allDay?: boolean;
  description?: string;
  attendees?: { name: string; avatar: string }[];
  source: EventSourceType;
}

faker.seed(789);

const generateAttendees = (count: number) => Array.from({ length: count }).map(() => ({
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
}));

const generateInitialEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // A few events scattered around the current month
  for (let i = 0; i < 15; i++) {
    const start = faker.date.recent({ days: 15 });
    const durationHours = faker.number.int({ min: 1, max: 4 });
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    
    events.push({
      id: faker.string.uuid(),
      title: faker.company.catchPhrase(),
      type: faker.helpers.arrayElement(['meeting', 'deadline', 'task', 'event']),
      start: start.toISOString(),
      description: faker.helpers.arrayElement([
        'Architecture review for multi-tenant schema partitioning and sharding.',
        'Bi-weekly sprint backlog grooming and velocity tracking.',
        'Cross-team technical demo and release checklist verification.',
        'Security audit review and compliance verification checklist.',
        'Executive revenue forecast and operational metrics review.',
      ]),
      source: 'internal',
    });
  }

  // Add one distinct today event
  const todayStart = new Date(today.setHours(14, 0, 0, 0));
  const todayEnd = new Date(today.setHours(15, 0, 0, 0));
  events.push({
    id: 'today-event-1',
    title: 'Product Sync',
    type: 'meeting',
    start: todayStart.toISOString(),
    end: todayEnd.toISOString(),
    description: 'Weekly sync on product roadmap.',
    attendees: generateAttendees(3),
    source: 'internal',
  });

  return events;
};

interface CalendarState {
  events: CalendarEvent[];
  isGoogleConnected: boolean;
  isConnectingGoogle: boolean;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'source'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: generateInitialEvents(),
  isGoogleConnected: false,
  isConnectingGoogle: false,

  addEvent: (event) => set((state) => ({
    events: [...state.events, { ...event, id: Math.random().toString(), source: 'internal' }]
  })),

  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),

  connectGoogleCalendar: async () => {
    set({ isConnectingGoogle: true });
    // Simulate OAuth delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Generate mock google events
    const today = new Date();
    const gEvents: CalendarEvent[] = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + (i - 2));
      d.setHours(10, 0, 0, 0);
      const end = new Date(d);
      end.setHours(11, 0, 0, 0);
      return {
        id: `gcal-${i}`,
        title: `Google Sync ${i + 1}`,
        type: 'meeting',
        start: d.toISOString(),
        end: end.toISOString(),
        source: 'google',
        description: 'Imported from Google Calendar',
      };
    });

    set((state) => ({
      isConnectingGoogle: false,
      isGoogleConnected: true,
      events: [...state.events, ...gEvents]
    }));
  },

  disconnectGoogleCalendar: () => set((state) => ({
    isGoogleConnected: false,
    events: state.events.filter(e => e.source !== 'google')
  })),
}));
