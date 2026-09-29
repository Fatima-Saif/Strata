'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Card, CardContent } from '@/components/ui/card';
import { useCalendarStore, CalendarEvent } from '@/lib/store/calendar-store';
import { EventDialog, EventDialogState } from '@/components/calendar/event-dialog';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './calendar.css';

export default function CalendarPage() {
  const { events } = useCalendarStore();
  const [dialogState, setDialogState] = React.useState<EventDialogState>({ isOpen: false, event: null });
  const calendarRef = React.useRef<FullCalendar>(null);

  // Map Zustand events to FullCalendar event format
  const fcEvents = React.useMemo(() => {
    return events.map(e => {
      // Determine colors based on type and source
      let bgColor = 'hsl(var(--primary))';
      let borderColor = 'hsl(var(--primary))';
      let textColor = 'hsl(var(--primary-foreground))';

      if (e.source === 'google') {
        bgColor = 'hsl(var(--blue-500) / 0.1)';
        borderColor = 'hsl(var(--blue-500))';
        textColor = 'hsl(var(--blue-600))';
      } else {
        switch (e.type) {
          case 'meeting':
            bgColor = 'hsl(var(--emerald-500) / 0.1)';
            borderColor = 'hsl(var(--emerald-500))';
            textColor = 'hsl(var(--emerald-600))';
            break;
          case 'deadline':
            bgColor = 'hsl(var(--destructive) / 0.1)';
            borderColor = 'hsl(var(--destructive))';
            textColor = 'hsl(var(--destructive))';
            break;
          case 'task':
            bgColor = 'hsl(var(--amber-500) / 0.1)';
            borderColor = 'hsl(var(--amber-500))';
            textColor = 'hsl(var(--amber-600))';
            break;
          case 'event':
          default:
            bgColor = 'hsl(var(--purple-500) / 0.1)';
            borderColor = 'hsl(var(--purple-500))';
            textColor = 'hsl(var(--purple-600))';
            break;
        }
      }

      return {
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: e.allDay,
        backgroundColor: bgColor,
        borderColor: borderColor,
        textColor: textColor,
        extendedProps: { ...e }
      };
    });
  }, [events]);

  const handleDateSelect = (selectInfo: any) => {
    setDialogState({
      isOpen: true,
      event: null,
      initialStart: selectInfo.start,
      initialEnd: selectInfo.end,
      initialAllDay: selectInfo.allDay
    });
    // clear selection
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    const rawEvent = clickInfo.event.extendedProps as CalendarEvent;
    setDialogState({
      isOpen: true,
      event: rawEvent
    });
  };

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader 
          title="Calendar & Scheduling" 
          description="Manage meetings, tasks, and deadlines in one place." 
        />
        <Button onClick={() => setDialogState({ isOpen: true, event: null, initialStart: new Date(), initialEnd: new Date(Date.now() + 3600000) })}>
          <CalendarIcon className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>

      <Card className="flex-1 min-h-[700px] flex flex-col">
        <CardContent className="flex-1 p-6 fc-theme-standard">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            editable={true} // Allow dragging to reschedule (would need onEventDrop to persist in store)
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={fcEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="100%"
          />
        </CardContent>
      </Card>

      <EventDialog state={dialogState} onClose={() => setDialogState({ isOpen: false, event: null })} />
    </PageTransition>
  );
}
