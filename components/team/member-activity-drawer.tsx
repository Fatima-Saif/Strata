'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TeamMember } from '@/lib/api/team';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { RecentActivity } from '@/components/dashboard/recent-activity';

interface MemberActivityDrawerProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberActivityDrawer({ member, open, onOpenChange }: MemberActivityDrawerProps) {
  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl">{member.name}</SheetTitle>
              <SheetDescription>{member.email}</SheetDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{member.role}</Badge>
                <Badge variant="secondary">{member.department}</Badge>
                <Badge 
                  variant={member.status === 'active' ? 'default' : 'secondary'}
                  className={member.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none' : ''}
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="text-sm text-muted-foreground">
            <strong>Last Login:</strong> {formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true })}
          </div>
          
          <div className="pt-2">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            {/* Reusing existing RecentActivity component from Phase 9 */}
            <div className="-mx-6">
              <RecentActivity />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
