'use client';

import * as React from 'react';
import { useReportEngineStore, ScheduledReport, ReportType, RecurrenceFreq } from '@/lib/store/report-engine-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Trash2, CalendarClock, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ScheduledReports() {
  const { scheduledReports, pauseSchedule, resumeSchedule, deleteSchedule, scheduleReport } = useReportEngineStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [newTitle, setNewTitle] = React.useState('');
  const [newType, setNewType] = React.useState<ReportType>('Revenue');
  const [newFreq, setNewFreq] = React.useState<RecurrenceFreq>('Weekly');
  const [newRecipients, setNewRecipients] = React.useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = newRecipients.split(',').map(e => e.trim()).filter(Boolean);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      toast.error(`Invalid emails: ${invalidEmails.join(', ')}`);
      return;
    }

    if (emails.length === 0) {
      toast.error('At least one recipient is required');
      return;
    }

    scheduleReport({
      title: newTitle,
      frequency: newFreq,
      recipients: emails,
      config: {
        type: newType,
        dateRange: { start: new Date().toISOString(), end: new Date().toISOString() },
        metrics: [] // Real implementation would allow selecting metrics here
      }
    });

    toast.success('Report scheduled successfully');
    setDialogOpen(false);
    setNewTitle('');
    setNewRecipients('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled report?')) {
      deleteSchedule(id);
      toast.success('Schedule deleted');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Scheduled & Emailed Reports</CardTitle>
          <CardDescription>Manage automated recurring report deliveries</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /> New Schedule</Button>} />
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Schedule a Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Schedule Name</Label>
                  <Input required value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., Weekly Exec Summary" />
                </div>
                <div className="grid gap-2">
                  <Label>Report Type</Label>
                  <Select value={newType} onValueChange={(v) => setNewType(v as ReportType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Frequency</Label>
                  <Select value={newFreq} onValueChange={(v) => setNewFreq(v as RecurrenceFreq)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Recipients (comma separated)</Label>
                  <Input required value={newRecipients} onChange={e => setNewRecipients(e.target.value)} placeholder="ceo@example.com, cfo@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {scheduledReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
            <CalendarClock className="h-8 w-8 mb-4 opacity-50" />
            <p>No reports are currently scheduled.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Report Name</th>
                  <th className="px-4 py-3 font-medium">Frequency</th>
                  <th className="px-4 py-3 font-medium">Recipients</th>
                  <th className="px-4 py-3 font-medium">Next Run</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.config.type}</p>
                    </td>
                    <td className="px-4 py-3">{report.frequency}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={report.recipients.join(', ')}>
                      {report.recipients.join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(report.nextRunDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={report.status === 'Active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {report.status === 'Active' ? (
                          <Button variant="ghost" size="icon" onClick={() => pauseSchedule(report.id)} title="Pause">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => resumeSchedule(report.id)} title="Resume">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(report.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
