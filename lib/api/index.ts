import { generateCustomers, generateInvoices, generateProject } from '../mock-data/generators';
import type { Customer, Invoice, Project } from '@/types';

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const ARTIFICIAL_DELAY_MS = 800; // configurable latency

// Singleton mock state to maintain consistency during a session
const state = {
  customers: generateCustomers(200),
  invoices: [] as Invoice[],
  projects: [] as Project[],
};

// Initialize dependent data
state.invoices = generateInvoices(state.customers, 500);
state.projects = state.customers.slice(0, 50).map((c) => generateProject(c.id));

export const getCustomers = async (): Promise<Customer[]> => {
  await delay(ARTIFICIAL_DELAY_MS);
  return state.customers;
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  await delay(ARTIFICIAL_DELAY_MS);
  return state.customers.find((c) => c.id === id);
};

export const getInvoices = async (): Promise<Invoice[]> => {
  await delay(ARTIFICIAL_DELAY_MS);
  return state.invoices;
};

export const getRevenueSeries = async (): Promise<{ month: string; revenue: number }[]> => {
  await delay(ARTIFICIAL_DELAY_MS);
  // Generate 12 months of fake revenue data
  return Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      revenue: Math.floor(Math.random() * 50000) + 10000,
    };
  });
};

export const getProjects = async (): Promise<Project[]> => {
  await delay(ARTIFICIAL_DELAY_MS);
  return state.projects;
};
