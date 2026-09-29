import { faker } from '@faker-js/faker';

// Invoices
export interface CustomerInvoice {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  pdfUrl: string;
}

export async function fetchCustomerInvoices(userId: string): Promise<CustomerInvoice[]> {
  await new Promise(r => setTimeout(r, 400));
  
  // Deterministic based on userId
  faker.seed(userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1));
  const count = faker.number.int({ min: 0, max: 12 });
  
  return Array.from({ length: count }).map(() => ({
    id: `INV-${faker.string.numeric(5)}`,
    amount: faker.number.float({ min: 19, max: 2499, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(['Paid', 'Paid', 'Paid', 'Pending', 'Overdue']),
    date: faker.date.recent({ days: 365 }).toISOString(),
    pdfUrl: '#',
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Projects
export interface CustomerProject {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
}

export async function fetchCustomerProjects(userId: string): Promise<CustomerProject[]> {
  await new Promise(r => setTimeout(r, 400));
  
  faker.seed(userId.charCodeAt(1) || 123);
  const count = faker.number.int({ min: 0, max: 4 });
  
  return Array.from({ length: count }).map(() => ({
    id: `PRJ-${faker.string.alphanumeric(4).toUpperCase()}`,
    name: faker.commerce.productName() + ' Migration',
    status: faker.helpers.arrayElement(['Active', 'Active', 'Completed', 'On Hold']),
    progress: faker.number.int({ min: 10, max: 100 }),
  }));
}

// Tickets
export interface CustomerTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Pending' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export async function fetchCustomerTickets(userId: string): Promise<CustomerTicket[]> {
  await new Promise(r => setTimeout(r, 300));
  
  faker.seed(userId.charCodeAt(2) || 456);
  const count = faker.number.int({ min: 0, max: 6 });
  
  return Array.from({ length: count }).map(() => ({
    id: `TKT-${faker.string.numeric(4)}`,
    subject: faker.hacker.phrase(),
    status: faker.helpers.arrayElement(['Open', 'Pending', 'Resolved', 'Resolved']),
    priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
    createdAt: faker.date.recent({ days: 90 }).toISOString(),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Notes
export interface CustomerNote {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

// Global in-memory store for notes so they persist across drawer opens
const notesStore: Record<string, CustomerNote[]> = {};

export async function fetchCustomerNotes(userId: string): Promise<CustomerNote[]> {
  await new Promise(r => setTimeout(r, 300));
  
  if (!notesStore[userId]) {
    const sampleCustomerNotes = [
      'Customer completed enterprise onboarding. Migrated 450 seats onto Strata.',
      'Requested dedicated VPC peering in eu-central-1 for high-volume transactions.',
      'Annual subscription renewed with 20 additional developer licenses.',
      'Scheduled quarterly technical business review with VP of Engineering.',
      'Reported positive feedback on API latency improvements after the v2 upgrade.',
    ];
    
    notesStore[userId] = Array.from({ length: count }).map(() => ({
      id: faker.string.uuid(),
      content: faker.helpers.arrayElement(sampleCustomerNotes),
      authorName: faker.person.fullName(),
      authorAvatar: faker.image.avatar(),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return [...notesStore[userId]];
}

export async function addCustomerNote(userId: string, content: string): Promise<CustomerNote> {
  await new Promise(r => setTimeout(r, 400));
  
  if (!notesStore[userId]) {
    notesStore[userId] = [];
  }
  
  const newNote: CustomerNote = {
    id: Math.random().toString(),
    content,
    authorName: 'Current User (You)',
    authorAvatar: 'https://i.pravatar.cc/150?u=current',
    createdAt: new Date().toISOString(),
  };
  
  notesStore[userId] = [newNote, ...notesStore[userId]];
  return newNote;
}
