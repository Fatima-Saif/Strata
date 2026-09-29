'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, User } from '@/lib/api/users';
import { DataTable } from '@/components/users/data-table';
import { columns } from '@/components/users/columns';
import { UserProfileDrawer } from '@/components/users/user-profile-drawer';
import { Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="User Management" 
          description="Manage your users, assign roles, and review account statuses."
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-[400px] text-destructive">
            Failed to load users.
          </div>
        ) : (
          <div className="mt-6">
            <DataTable 
              columns={columns} 
              data={users || []} 
              onRowClick={setSelectedUser}
            />
          </div>
        )}
      </div>

      <UserProfileDrawer 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />
    </PageTransition>
  );
}
