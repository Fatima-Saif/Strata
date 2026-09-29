'use client';

import * as React from 'react';
import { usePermission } from '@/hooks/use-permission';
import { Role } from '@/types';

interface RequireRoleProps {
  children: React.ReactNode;
  minimumRole: Role;
  fallback?: React.ReactNode;
}

export function RequireRole({ children, minimumRole, fallback = null }: RequireRoleProps) {
  const { hasRole } = usePermission();

  if (!hasRole(minimumRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
