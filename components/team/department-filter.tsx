'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function DepartmentFilter({ value, onChange }: DepartmentFilterProps) {
  return (
    <Select value={value} onValueChange={(val: string | null) => val && onChange(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by Department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All Departments</SelectItem>
        <SelectItem value="Engineering">Engineering</SelectItem>
        <SelectItem value="Sales">Sales</SelectItem>
        <SelectItem value="Marketing">Marketing</SelectItem>
        <SelectItem value="Support">Support</SelectItem>
      </SelectContent>
    </Select>
  );
}
