import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/types';

export type PermissionKey = 
  | 'view_dashboard'
  | 'view_reports'
  | 'manage_users'
  | 'delete_users'
  | 'edit_billing'
  | 'manage_api_keys'
  | 'manage_team';

export type RolePermissions = Record<PermissionKey, boolean>;

export type PermissionsMatrix = Record<Role, RolePermissions>;

const defaultMatrix: PermissionsMatrix = {
  Admin: {
    view_dashboard: true,
    view_reports: true,
    manage_users: true,
    delete_users: true,
    edit_billing: true,
    manage_api_keys: true,
    manage_team: true,
  },
  Manager: {
    view_dashboard: true,
    view_reports: true,
    manage_users: true,
    delete_users: false,
    edit_billing: true,
    manage_api_keys: false,
    manage_team: true,
  },
  Developer: {
    view_dashboard: true,
    view_reports: false,
    manage_users: false,
    delete_users: false,
    edit_billing: false,
    manage_api_keys: true,
    manage_team: false,
  },
  Viewer: {
    view_dashboard: true,
    view_reports: true,
    manage_users: false,
    delete_users: false,
    edit_billing: false,
    manage_api_keys: false,
    manage_team: false,
  },
};

interface PermissionsState {
  matrix: PermissionsMatrix;
  setMatrix: (newMatrix: PermissionsMatrix) => void;
  updatePermission: (role: Role, permission: PermissionKey, value: boolean) => void;
  can: (role: Role, permission: PermissionKey) => boolean;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set, get) => ({
      matrix: defaultMatrix,
      setMatrix: (newMatrix) => set({ matrix: newMatrix }),
      updatePermission: (role, permission, value) => set((state) => {
        // Prevent Admin from losing critical safeguards
        if (role === 'Admin' && permission === 'manage_team' && !value) {
          return state;
        }
        return {
          matrix: {
            ...state.matrix,
            [role]: {
              ...state.matrix[role],
              [permission]: value
            }
          }
        };
      }),
      can: (role, permission) => {
        return get().matrix[role]?.[permission] ?? false;
      },
    }),
    {
      name: 'permissions-storage',
    }
  )
);
