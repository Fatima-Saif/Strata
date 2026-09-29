import { faker } from '@faker-js/faker';
import { Role } from '@/types';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface PendingInvite {
  id: string;
  emails: string[];
  role: Role;
  department: string;
  invitedAt: string;
  invitedBy: string;
}

faker.seed(456);

export let mockTeamMembers: TeamMember[] = Array.from({ length: 8 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  role: faker.helpers.arrayElement(['Admin', 'Manager', 'Developer', 'Viewer'] as Role[]),
  department: faker.helpers.arrayElement(['Engineering', 'Sales', 'Support', 'Marketing']),
  avatar: faker.image.avatar(),
  lastLogin: faker.date.recent({ days: 10 }).toISOString(),
  status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
}));

// Make sure we have at least one of each role/department
mockTeamMembers[0] = { ...mockTeamMembers[0], role: 'Admin', department: 'Engineering', status: 'active' };

export let mockPendingInvites: PendingInvite[] = [
  {
    id: faker.string.uuid(),
    emails: ['newhire1@example.com', 'newhire2@example.com'],
    role: 'Developer',
    department: 'Engineering',
    invitedAt: faker.date.recent({ days: 2 }).toISOString(),
    invitedBy: 'Admin User',
  },
  {
    id: faker.string.uuid(),
    emails: ['contractor@example.com'],
    role: 'Viewer',
    department: 'Marketing',
    invitedAt: faker.date.recent({ days: 5 }).toISOString(),
    invitedBy: 'Manager User',
  }
];

export async function fetchTeamMembers(departmentFilter?: string): Promise<TeamMember[]> {
  await new Promise(r => setTimeout(r, 400));
  if (departmentFilter && departmentFilter !== 'All') {
    return mockTeamMembers.filter(m => m.department === departmentFilter);
  }
  return [...mockTeamMembers];
}

export async function fetchPendingInvites(): Promise<PendingInvite[]> {
  await new Promise(r => setTimeout(r, 300));
  return [...mockPendingInvites];
}

export async function inviteMembers(emails: string[], role: Role, department: string): Promise<void> {
  await new Promise(r => setTimeout(r, 600));
  mockPendingInvites.unshift({
    id: faker.string.uuid(),
    emails,
    role,
    department,
    invitedAt: new Date().toISOString(),
    invitedBy: 'Current User',
  });
}

export async function revokeInvite(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 400));
  mockPendingInvites = mockPendingInvites.filter(inv => inv.id !== id);
}

export async function resendInvite(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 400));
  // Just mock delay for resending
}
