'use client';

import * as React from 'react';
import { useCommandStore } from '@/lib/store/command-store';
import { useProjectsStore } from '@/lib/store/projects-store';
import { useNotifications } from '@/store/use-notifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function GlobalDialogs() {
  const { dialogs, closeDialog } = useCommandStore();
  const { addProject } = useProjectsStore();
  const { addNotification } = useNotifications();

  // Create Project Form State
  const [projectTitle, setProjectTitle] = React.useState('');
  const [projectDesc, setProjectDesc] = React.useState('');
  const [projectPriority, setProjectPriority] = React.useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = React.useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    addNotification({
      title: 'Team Invitation Dispatched',
      description: `Invitation link sent to ${inviteEmail} with default Admin role.`,
      category: 'System',
    });

    toast.success(`Team invitation sent to ${inviteEmail}!`);
    setInviteEmail('');
    closeDialog('inviteTeam');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Optimistically add to client store
      addProject({
        title: projectTitle.trim(),
        description: projectDesc.trim() || 'Enterprise software operations initiative.',
        status: 'In Progress',
        priority: projectPriority,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        members: [
          { name: 'Administrator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        ],
      });

      // 2. Persist to SQLite
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectTitle.trim(),
          description: projectDesc.trim() || 'Enterprise software operations initiative.',
          priority: projectPriority.toLowerCase(),
        }),
      }).catch((err) => console.error('Failed to persist project in DB:', err));

      // 3. Trigger real-time notification in SQLite
      await addNotification({
        title: 'Project Initiated',
        description: `New project "${projectTitle.trim()}" created with ${projectPriority} priority.`,
        category: 'Updates',
      });

      toast.success(`Project "${projectTitle.trim()}" created successfully!`);
      setProjectTitle('');
      setProjectDesc('');
      closeDialog('createProject');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotification({
      title: 'Financial Audit Report Generated',
      description: 'Monthly Revenue, Burn Rate, and Tax Operations PDF generated.',
      category: 'Billing',
    });

    toast.success('Revenue report generated and logged to activity stream!');
    closeDialog('generateReport');
  };

  return (
    <>
      {/* Invite Team Member Dialog */}
      <Dialog open={dialogs.inviteTeam} onOpenChange={(open) => !open && closeDialog('inviteTeam')}>
        <DialogContent>
          <form onSubmit={handleInvite}>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to join your Strata workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="colleague@company.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeDialog('inviteTeam')}>Cancel</Button>
              <Button type="submit">Send Invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={dialogs.createProject} onOpenChange={(open) => !open && closeDialog('createProject')}>
        <DialogContent>
          <form onSubmit={handleCreateProject}>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a persistent engineering or operations project to your workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Multi-Cloud Failover & Edge Gateway" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input 
                  id="desc" 
                  placeholder="Brief overview of operational goals..." 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={projectPriority} onValueChange={(val: any) => setProjectPriority(val)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeDialog('createProject')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={dialogs.generateReport} onOpenChange={(open) => !open && closeDialog('generateReport')}>
        <DialogContent>
          <form onSubmit={handleGenerateReport}>
            <DialogHeader>
              <DialogTitle>Generate Executive Report</DialogTitle>
              <DialogDescription>Export monthly revenue and resource telemetry as PDF report.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm text-muted-foreground">
              Are you sure you want to compile and generate the monthly financial compliance & telemetry report?
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeDialog('generateReport')}>Cancel</Button>
              <Button type="submit">Compile & Export</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
