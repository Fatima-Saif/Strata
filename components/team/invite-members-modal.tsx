'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteMembers } from '@/lib/api/team';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface InviteMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMembersModal({ open, onOpenChange }: InviteMembersModalProps) {
  const queryClient = useQueryClient();
  const [emailInput, setEmailInput] = React.useState('');
  const [emails, setEmails] = React.useState<string[]>([]);
  const [role, setRole] = React.useState<Role>('Viewer');
  const [department, setDepartment] = React.useState('Engineering');

  const inviteMutation = useMutation({
    mutationFn: () => inviteMembers(emails, role, department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      toast.success('Invitations sent successfully');
      resetAndClose();
    }
  });

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = emailInput.trim().replace(',', '');
      if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && !emails.includes(val)) {
        setEmails([...emails, val]);
        setEmailInput('');
      } else if (val) {
        toast.error('Please enter a valid email address');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const resetAndClose = () => {
    setEmails([]);
    setEmailInput('');
    setRole('Viewer');
    setDepartment('Engineering');
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) {
      toast.error('Please add at least one email address');
      return;
    }
    inviteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetAndClose();
      else onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Invite new members to collaborate. Press enter or comma to add multiple emails.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {emails.map(email => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                    {email}
                    <button 
                      type="button" 
                      onClick={() => removeEmail(email)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                placeholder="colleague@example.com, ..."
                type="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v: string | null) => v && setRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={department} onValueChange={(v: string | null) => v && setDepartment(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAndClose} disabled={inviteMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending || emails.length === 0}>
              {inviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
