'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTeamMembers, fetchPendingInvites, revokeInvite, resendInvite, TeamMember } from '@/lib/api/team';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Mail, Trash, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { InviteMembersModal } from './invite-members-modal';
import { DepartmentFilter } from './department-filter';
import { MemberActivityDrawer } from './member-activity-drawer';

export function TeamMembersList() {
  const queryClient = useQueryClient();
  const [department, setDepartment] = React.useState('All');
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['team-members', department],
    queryFn: () => fetchTeamMembers(department),
  });

  const { data: invites, isLoading: loadingInvites } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: fetchPendingInvites,
  });

  const revokeMutation = useMutation({
    mutationFn: revokeInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      toast.success('Invitation revoked');
    }
  });

  const resendMutation = useMutation({
    mutationFn: resendInvite,
    onSuccess: () => {
      toast.success('Invitation resent');
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your organization's members.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <DepartmentFilter value={department} onChange={setDepartment} />
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Members
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingMembers ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{member.department}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.status === 'active' ? 'default' : 'secondary'}
                          className={member.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none' : ''}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMember(member)}>
                          View Activity
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {members?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          </div>
                          <h3 className="text-lg font-semibold tracking-tight">No members found</h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            {department !== 'All' ? `No team members found in the ${department} department.` : 'You don\'t have any team members yet.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Invitations sent but not yet accepted.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInvites ? (
            <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : !invites || invites.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">No pending invitations.</div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-card border-dashed">
                  <div>
                    <div className="font-medium text-sm flex gap-2">
                      {invite.emails.join(', ')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-2 items-center">
                      <Badge variant="outline" className="text-[10px]">{invite.role}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{invite.department}</Badge>
                      <span>Invited {formatDistanceToNow(new Date(invite.invitedAt))} ago by {invite.invitedBy}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => resendMutation.mutate(invite.id)}
                      disabled={resendMutation.isPending}
                    >
                      <Mail className="h-4 w-4 mr-2" /> Resend
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => revokeMutation.mutate(invite.id)}
                      disabled={revokeMutation.isPending}
                    >
                      <Trash className="h-4 w-4 mr-2" /> Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteMembersModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <MemberActivityDrawer member={selectedMember} open={!!selectedMember} onOpenChange={(v) => !v && setSelectedMember(null)} />
    </div>
  );
}
