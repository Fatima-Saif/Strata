import { renderHook } from '@testing-library/react';
import { usePermission } from './use-permission';
import { usePermissionsStore } from '@/lib/store/permissions-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('usePermission', () => {
  beforeEach(() => {
    // Reset store before each test
    usePermissionsStore.setState({ role: 'admin' });
  });

  it('allows access for admin role on sensitive actions', () => {
    const { result } = renderHook(() => usePermission());
    expect(result.current.hasRole(['admin'])).toBe(true);
    expect(result.current.can('manage_billing')).toBe(true);
  });

  it('denies access for viewer role on sensitive actions', () => {
    usePermissionsStore.setState({ role: 'viewer' });
    const { result } = renderHook(() => usePermission());
    expect(result.current.hasRole(['admin'])).toBe(false);
    expect(result.current.can('manage_billing')).toBe(false);
    expect(result.current.can('view_reports')).toBe(true);
  });
  
  it('handles empty roles array correctly in hasRole', () => {
    usePermissionsStore.setState({ role: 'manager' });
    const { result } = renderHook(() => usePermission());
    expect(result.current.hasRole([])).toBe(false);
  });
});
