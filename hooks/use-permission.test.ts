import { renderHook } from '@testing-library/react';
import { usePermission } from './use-permission';
import { vi, describe, it, expect } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { name: 'Admin User', role: 'Admin' } },
  }),
}));

describe('usePermission', () => {
  it('allows access for admin role on sensitive actions', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.hasRole('Admin')).toBe(true);
    expect(result.current.can('edit_billing')).toBe(true);
  });

  it('checks developer and manager role levels correctly', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isManagerOrHigher).toBe(true);
    expect(result.current.isDeveloperOrHigher).toBe(true);
    expect(result.current.can('view_reports')).toBe(true);
  });
});
