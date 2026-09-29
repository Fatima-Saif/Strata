import { faker } from '@faker-js/faker';

export type UserPlan = 'Free' | 'Pro' | 'Enterprise';
export type UserStatus = 'Active' | 'Inactive' | 'Pending';
export type UserRole = 'Admin' | 'Member' | 'Viewer' | 'Billing';

export interface User {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  company: string;
  plan: UserPlan;
  status: UserStatus;
  role: UserRole;
  joinedAt: string;
  ltv: number;
}

// Ensure deterministic mock data
faker.seed(12345);

const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    avatarUrl: faker.image.avatar(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
    address: faker.location.streetAddress(),
    country: faker.location.countryCode(),
    company: faker.company.name(),
    plan: faker.helpers.arrayElement(['Free', 'Pro', 'Enterprise', 'Pro', 'Free']),
    status: faker.helpers.arrayElement(['Active', 'Active', 'Active', 'Inactive', 'Pending']),
    role: faker.helpers.arrayElement(['Admin', 'Member', 'Member', 'Member', 'Viewer', 'Billing']),
    joinedAt: faker.date.past({ years: 2 }).toISOString(),
    ltv: faker.number.int({ min: 0, max: 50000 }),
  }));
};

// In-memory store for mock CRUD
let mockUsers = generateMockUsers(245);

export async function fetchUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
  return [...mockUsers];
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  
  // Simulate 10% failure rate for optimistic update demo
  if (Math.random() < 0.1) {
    throw new Error('Simulated network failure');
  }

  mockUsers[index] = { ...mockUsers[index], ...data };
  return { ...mockUsers[index] };
}

export async function deleteUsers(ids: string[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  mockUsers = mockUsers.filter(u => !ids.includes(u.id));
}
