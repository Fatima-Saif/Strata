import { faker } from '@faker-js/faker';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Cancelled';

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  disputeStage?: 'Submitted' | 'Under Review' | 'Resolved';
}

export interface PaymentMethod {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

// Seed for determinism
faker.seed(123);

const generateMockInvoices = (count: number): Invoice[] => {
  return Array.from({ length: count }).map(() => {
    const status = faker.helpers.arrayElement(['Paid', 'Paid', 'Paid', 'Pending', 'Failed', 'Refunded', 'Cancelled']) as InvoiceStatus;
    const hasDispute = status === 'Refunded' || status === 'Failed' ? faker.datatype.boolean() : false;
    
    return {
      id: `INV-${faker.string.numeric(5)}`,
      customerName: faker.person.fullName(),
      customerEmail: faker.internet.email(),
      amount: faker.number.float({ min: 19, max: 2499, fractionDigits: 2 }),
      status,
      date: faker.date.recent({ days: 365 }).toISOString(),
      ...(hasDispute && { disputeStage: faker.helpers.arrayElement(['Submitted', 'Under Review', 'Resolved']) }),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// In-memory stores
let mockInvoices = generateMockInvoices(50);
let mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', brand: 'visa', last4: '4242', expiryMonth: '12', expiryYear: '2028', isDefault: true },
  { id: 'pm_2', brand: 'mastercard', last4: '5555', expiryMonth: '08', expiryYear: '2026', isDefault: false },
];

export async function fetchInvoices(): Promise<Invoice[]> {
  await new Promise(r => setTimeout(r, 600));
  return [...mockInvoices];
}

export async function processRefund(invoiceId: string, amount: number, reason: string): Promise<Invoice> {
  await new Promise(r => setTimeout(r, 800));
  const idx = mockInvoices.findIndex(i => i.id === invoiceId);
  if (idx === -1) throw new Error("Invoice not found");
  
  mockInvoices[idx] = { 
    ...mockInvoices[idx], 
    status: 'Refunded',
    disputeStage: 'Resolved'
  };
  return { ...mockInvoices[idx] };
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  await new Promise(r => setTimeout(r, 400));
  return [...mockPaymentMethods];
}

export async function addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
  await new Promise(r => setTimeout(r, 1000));
  const newMethod = { ...method, id: `pm_${Date.now()}` };
  
  if (newMethod.isDefault) {
    mockPaymentMethods = mockPaymentMethods.map(pm => ({ ...pm, isDefault: false }));
  }
  
  mockPaymentMethods = [...mockPaymentMethods, newMethod];
  return newMethod;
}

export async function removePaymentMethod(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 600));
  mockPaymentMethods = mockPaymentMethods.filter(pm => pm.id !== id);
}

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 500));
  mockPaymentMethods = mockPaymentMethods.map(pm => ({
    ...pm,
    isDefault: pm.id === id
  }));
}
