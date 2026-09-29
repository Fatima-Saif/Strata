import { faker } from '@faker-js/faker';
import type { User, Customer, Invoice, Subscription, Plan, Project, Notification, ActivityEvent, SecurityEvent } from '@/types';

const PLANS: Plan[] = [
  { id: 'plan_basic_m', name: 'Basic', price: 29, interval: 'month' },
  { id: 'plan_pro_m', name: 'Pro', price: 99, interval: 'month' },
  { id: 'plan_ent_y', name: 'Enterprise', price: 999, interval: 'year' },
];

export const generateCustomer = (): Customer => {
  return {
    id: faker.string.uuid(),
    company: faker.company.name(),
    contactName: faker.person.fullName(),
    email: faker.internet.email(),
    plan: faker.helpers.arrayElement(PLANS),
    status: faker.helpers.arrayElement(['active', 'active', 'active', 'churned', 'trialing']),
    joinedAt: faker.date.past({ years: 2 }).toISOString(),
    country: faker.location.countryCode(),
  };
};

export const generateCustomers = (count = 200): Customer[] => {
  return Array.from({ length: count }, generateCustomer);
};

export const generateInvoice = (customerId: string): Invoice => {
  const isPaid = faker.datatype.boolean(0.8); // 80% paid
  return {
    id: faker.string.uuid(),
    customerId,
    amount: faker.number.int({ min: 29, max: 999 }),
    status: isPaid ? 'paid' : faker.helpers.arrayElement(['pending', 'overdue']),
    issuedAt: faker.date.recent({ days: 60 }).toISOString(),
    dueDate: faker.date.future({ years: 0.1 }).toISOString(),
  };
};

export const generateInvoices = (customers: Customer[], count = 500): Invoice[] => {
  return Array.from({ length: count }, () => generateInvoice(faker.helpers.arrayElement(customers).id));
};

export const generateProject = (customerId: string): Project => {
  return {
    id: faker.string.uuid(),
    customerId,
    name: faker.commerce.productName(),
    status: faker.helpers.arrayElement(['active', 'completed', 'archived']),
    progress: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  };
};
