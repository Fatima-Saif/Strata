'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembersList } from '@/components/team/team-members-list';
import { PermissionsMatrix } from '@/components/team/permissions-matrix';
import { Users, ShieldCheck } from 'lucide-react';
import { usePermission } from '@/hooks/use-permission';

export default function TeamPage() {
  const { can } = usePermission();

  return (
    <PageTransition>
      <PageHeader 
        title="Team Management" 
        description="Manage members, departments, and granular access permissions." 
      />
      
      <Tabs defaultValue="members" className="space-y-6 pb-10">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Members
          </TabsTrigger>
          {can('manage_team') && (
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Roles & Permissions
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="members" className="mt-0">
          <TeamMembersList />
        </TabsContent>

        {can('manage_team') && (
          <TabsContent value="permissions" className="mt-0">
            <PermissionsMatrix />
          </TabsContent>
        )}
      </Tabs>
    </PageTransition>
  );
}
