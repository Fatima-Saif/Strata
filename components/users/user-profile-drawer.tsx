'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { User } from '@/lib/api/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge, PlanBadge } from './columns';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// We'll build these in subsequent steps
import { OverviewTab } from './profile-tabs/overview-tab';
import { SubscriptionTab } from './profile-tabs/subscription-tab';
import { InvoicesTab } from './profile-tabs/invoices-tab';
import { ProjectsTab } from './profile-tabs/projects-tab';
import { ActivityTab } from './profile-tabs/activity-tab';
import { TicketsTab } from './profile-tabs/tickets-tab';
import { NotesTab } from './profile-tabs/notes-tab';

interface UserProfileDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDrawer({ user, open, onOpenChange }: UserProfileDrawerProps) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col p-0 border-l border-border gap-0" side="right">
        {/* Sticky Header */}
        <SheetHeader className="p-6 border-b border-border bg-background/95 backdrop-blur shrink-0 relative z-10 text-left">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <SheetTitle className="text-2xl">{user.name}</SheetTitle>
                <StatusBadge status={user.status} />
              </div>
              <SheetDescription className="text-base mt-1">
                {user.role} at {user.company}
              </SheetDescription>
            </div>
            <div className="text-right hidden sm:block">
              <PlanBadge plan={user.plan} />
              <p className="text-xs text-muted-foreground mt-2">
                Joined {format(new Date(user.joinedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Body with Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b border-border shrink-0">
            <TabsList className="bg-transparent h-12 p-0 w-full justify-start overflow-x-auto rounded-none flex-nowrap" variant="line">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent">Overview</TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-transparent">Subscription</TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-transparent">Invoices</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-transparent">Projects</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-transparent">Activity</TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-transparent">Tickets</TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-transparent">Notes</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-muted/10 p-6">
            <TabsContent value="overview" className="m-0 focus-visible:outline-none h-full">
              <OverviewTab user={user} />
            </TabsContent>
            <TabsContent value="subscription" className="m-0 focus-visible:outline-none h-full">
              <SubscriptionTab user={user} />
            </TabsContent>
            <TabsContent value="invoices" className="m-0 focus-visible:outline-none h-full">
              <InvoicesTab userId={user.id} />
            </TabsContent>
            <TabsContent value="projects" className="m-0 focus-visible:outline-none h-full">
              <ProjectsTab userId={user.id} />
            </TabsContent>
            <TabsContent value="activity" className="m-0 focus-visible:outline-none h-full">
              <ActivityTab userId={user.id} />
            </TabsContent>
            <TabsContent value="tickets" className="m-0 focus-visible:outline-none h-full">
              <TicketsTab userId={user.id} />
            </TabsContent>
            <TabsContent value="notes" className="m-0 focus-visible:outline-none h-full">
              <NotesTab userId={user.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
