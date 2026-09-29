import { faker } from '@faker-js/faker';

export interface ApiUsageData {
  totalRequests: number;
  successRate: number;
  failedRequests: number;
  avgLatency: number; // in ms
}

export interface ApiTimeSeriesPoint {
  date: string;
  success: number;
  failed: number;
}

export interface EndpointMetric {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestCount: number;
  avgLatency: number;
  errorRate: number;
}

export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  createdAt: string;
  lastUsed?: string;
  secretReveal?: string; // only present on creation
}

faker.seed(456);

// Mock Data
export const mockApiUsage: ApiUsageData = {
  totalRequests: 84210,
  successRate: 98.2,
  failedRequests: 1516,
  avgLatency: 124,
};

export const generateTimeSeries = (days: number): ApiTimeSeriesPoint[] => {
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - i - 1));
    const baseRequests = faker.number.int({ min: 1000, max: 4000 });
    const failed = faker.number.int({ min: 10, max: baseRequests * 0.05 });
    return {
      date: d.toISOString(),
      success: baseRequests - failed,
      failed,
    };
  });
};

export const mockEndpoints: EndpointMetric[] = [
  { path: '/v1/users', method: 'GET', requestCount: 34500, avgLatency: 85, errorRate: 0.2 },
  { path: '/v1/users', method: 'POST', requestCount: 8200, avgLatency: 210, errorRate: 1.5 },
  { path: '/v1/invoices', method: 'GET', requestCount: 22100, avgLatency: 150, errorRate: 0.8 },
  { path: '/v1/payments/process', method: 'POST', requestCount: 15400, avgLatency: 840, errorRate: 6.2 }, // high error rate
  { path: '/v1/reports/export', method: 'GET', requestCount: 4010, avgLatency: 2500, errorRate: 2.1 },
];

let mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Key',
    maskedKey: 'sk_live_...9a8f',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'key_2',
    name: 'Development Testing',
    maskedKey: 'sk_test_...3b2c',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export async function fetchApiUsage(): Promise<ApiUsageData> {
  await new Promise(r => setTimeout(r, 400));
  return mockApiUsage;
}

export async function fetchApiTimeSeries(days: number = 30): Promise<ApiTimeSeriesPoint[]> {
  await new Promise(r => setTimeout(r, 500));
  return generateTimeSeries(days);
}

export async function fetchTopEndpoints(): Promise<EndpointMetric[]> {
  await new Promise(r => setTimeout(r, 300));
  return [...mockEndpoints].sort((a, b) => b.requestCount - a.requestCount);
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  await new Promise(r => setTimeout(r, 400));
  return [...mockApiKeys];
}

export async function generateApiKey(name: string): Promise<ApiKey> {
  await new Promise(r => setTimeout(r, 800));
  const newId = `key_${Date.now()}`;
  const randomHex = faker.string.hexadecimal({ length: 24, prefix: '' }).toLowerCase();
  const secret = `sk_live_${randomHex}`;
  const maskedKey = `sk_live_...${secret.slice(-4)}`;
  
  const newKey: ApiKey = {
    id: newId,
    name,
    maskedKey,
    createdAt: new Date().toISOString(),
    secretReveal: secret,
  };
  
  mockApiKeys = [...mockApiKeys, newKey];
  return newKey;
}

export async function deleteApiKey(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 600));
  mockApiKeys = mockApiKeys.filter(k => k.id !== id);
}
