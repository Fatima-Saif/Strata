'use client';

import * as React from 'react';
import { useCalendarStore, CalendarEvent } from '@/lib/store/calendar-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface EventDialogState {
  isOpen: boolean;
  event: CalendarEvent | null; // If null, it's a creation flow. If exists, it's edit flow.
  initialStart?: Date;
  initialEnd?: Date;
  initialAllDay?: boolean;
}

interface EventDialogProps {
  state: EventDialogState;
  onClose: () => void;
}

export function EventDialog({ state, onClose }: EventDialogProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore();

  const isEdit = !!state.event;

  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<CalendarEvent['type']>('meeting');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Reset/populate form when dialog opens
  React.useEffect(() => {
    if (state.isOpen) {
      if (state.event) {
        setTitle(state.event.title);
        setType(state.event.type);
        setStart(state.event.start.substring(0, 16)); // Format for datetime-local
        setEnd(state.event.end.substring(0, 16));
        setDescription(state.event.description || '');
      } else {
        setTitle('');
        setType('meeting');
        setDescription('');
        // Format dates correctly for local input
        if (state.initialStart) {
          const tzOffset = (new Date()).getTimezoneOffset() * 60000;
          const localStart = new Date(state.initialStart.getTime() - tzOffset);
          setStart(localStart.toISOString().substring(0, 16));
        }
        if (state.initialEnd) {
          const tzOffset = (new Date()).getTimezoneOffset() * 60000;
          const localEnd = new Date(state.initialEnd.getTime() - tzOffset);
          setEnd(localEnd.toISOString().substring(0, 16));
        }
      }
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate <= startDate) {
      toast.error('End time must be after start time.');
      return;
    }

    if (isEdit && state.event) {
      updateEvent(state.event.id, {
        title,
        type,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description,
      });
      toast.success('Event updated');
    } else {
      addEvent({
        title,
        type,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description,
      });
      toast.success('Event created');
    }
    onClose();
  };

  const handleDelete = () => {
    if (!state.event) return;
    const hasAttendees = state.event.attendees && state.event.attendees.length > 0;
    if (hasAttendees) {
      if (!window.confirm('This event has attendees. Are you sure you want to delete it?')) {
        return;
      }
    }
    deleteEvent(state.event.id);
    toast.success('Event deleted');
    onClose();
  };

  return (
    <Dialog open={state.isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Event' : 'New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" />
            </div>
            
            <div className="grid gap-2">
              <Label>Event Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="event">General Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start</Label>
                <Input type="datetime-local" required value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>End</Label>
                <Input type="datetime-local" required value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details..." />
            </div>
            
            {isEdit && state.event?.source === 'google' && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                This event is synced from Google Calendar.
              </div>
            )}
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {isEdit && state.event?.source !== 'google' ? (
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={state.event?.source === 'google'}>{isEdit ? 'Save Changes' : 'Create'}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
