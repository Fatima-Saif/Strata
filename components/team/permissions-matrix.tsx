'use client';

import * as React from 'react';
import { usePermissionsStore, PermissionKey, PermissionsMatrix as PermissionsMatrixType } from '@/lib/store/permissions-store';
import { Role } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const roles: Role[] = ['Admin', 'Manager', 'Developer', 'Viewer'];
const permissionsList: { key: PermissionKey; label: string; description: string }[] = [
  { key: 'view_dashboard', label: 'View Dashboard', description: 'Access to main analytics dashboard' },
  { key: 'view_reports', label: 'View Reports', description: 'Access to financial and revenue reports' },
  { key: 'manage_users', label: 'Manage Users', description: 'Can invite and edit user details' },
  { key: 'delete_users', label: 'Delete Users', description: 'Can permanently remove users' },
  { key: 'edit_billing', label: 'Edit Billing', description: 'Manage invoices, subscriptions, and payment methods' },
  { key: 'manage_api_keys', label: 'Manage API Keys', description: 'Create and revoke API keys' },
  { key: 'manage_team', label: 'Manage Team', description: 'Can modify team roles and permissions matrix' },
];

export function PermissionsMatrix() {
  const storeMatrix = usePermissionsStore((state) => state.matrix);
  const setStoreMatrix = usePermissionsStore((state) => state.setMatrix);

  // Local state for editing before saving
  const [localMatrix, setLocalMatrix] = React.useState<PermissionsMatrixType>(storeMatrix);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Warn on unmount if unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Sync if global store changes outside
  React.useEffect(() => {
    setLocalMatrix(storeMatrix);
    setHasChanges(false);
  }, [storeMatrix]);

  const togglePermission = (role: Role, perm: PermissionKey, checked: boolean) => {
    // Admin safeguard: Cannot disable manage_team for Admin
    if (role === 'Admin' && perm === 'manage_team' && !checked) {
      toast.error('Cannot revoke "Manage Team" permission from Admin role.');
      return;
    }

    setLocalMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: checked
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setStoreMatrix(localMatrix);
    setHasChanges(false);
    toast.success('Permissions matrix updated successfully');
  };

  const handleDiscard = () => {
    setLocalMatrix(storeMatrix);
    setHasChanges(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>Configure granular access control for each role across the application.</CardDescription>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 text-warning text-sm font-medium animate-pulse">
              <AlertCircle className="h-4 w-4" /> Unsaved changes
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Permission</TableHead>
              {roles.map(role => (
                <TableHead key={role} className="text-center">{role}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsList.map((perm) => (
              <TableRow key={perm.key}>
                <TableCell>
                  <div className="font-medium text-sm">{perm.label}</div>
                  <div className="text-xs text-muted-foreground">{perm.description}</div>
                </TableCell>
                {roles.map((role) => (
                  <TableCell key={`${role}-${perm.key}`} className="text-center">
                    <Switch 
                      checked={localMatrix[role][perm.key]}
                      onCheckedChange={(checked) => togglePermission(role, perm.key, checked)}
                      disabled={role === 'Admin' && perm.key === 'manage_team'}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {hasChanges && (
        <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/20">
          <Button variant="ghost" onClick={handleDiscard}>Discard Changes</Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
