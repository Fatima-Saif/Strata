import { useSession } from 'next-auth/react';
import { Role } from '@/types';
import { usePermissionsStore, PermissionKey } from '@/lib/store/permissions-store';

// Legacy role hierarchy for backwards compatibility if needed
const roleHierarchy: Record<Role, number> = {
  Viewer: 0,
  Developer: 1,
  Manager: 2,
  Admin: 3,
};

export function usePermission() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) || 'Viewer';
  const { can: storeCan } = usePermissionsStore();

  const hasRole = (minimumRole: Role): boolean => {
    return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
  };

  const isAdmin = userRole === 'Admin';
  const isManagerOrHigher = hasRole('Manager');
  const isDeveloperOrHigher = hasRole('Developer');

  // Granular check wired directly to the visual Matrix store
  const can = (permission: PermissionKey): boolean => {
    return storeCan(userRole, permission);
  };

  return {
    userRole,
    hasRole,
    isAdmin,
    isManagerOrHigher,
    isDeveloperOrHigher,
    can,
  };
}
