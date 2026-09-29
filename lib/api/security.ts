import { faker } from '@faker-js/faker';

export interface SecurityScoreFactors {
  twoFactorEnabled: boolean;
  recentPasswordChange: boolean;
  noLeakedCredentials: boolean;
  activeSessionCount: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  current: boolean;
  lastActive: string;
}

export interface LoginEvent {
  id: string;
  date: string;
  location: string;
  device: string;
  ip: string;
  status: 'success' | 'blocked' | 'failed';
}

export interface SecurityEvent {
  id: string;
  date: string;
  type: 'password_change' | 'login' | 'permission' | '2fa';
  description: string;
}

faker.seed(789);

// Mock State
export let mockSecurityFactors: SecurityScoreFactors = {
  twoFactorEnabled: false,
  recentPasswordChange: true,
  noLeakedCredentials: true,
  activeSessionCount: 3,
};

export let mockSessions: ActiveSession[] = [
  {
    id: 'sess_current',
    device: 'MacBook Pro',
    browser: 'Chrome 114.0',
    ip: '192.168.1.5',
    location: 'San Francisco, CA',
    current: true,
    lastActive: new Date().toISOString(),
  },
  {
    id: 'sess_2',
    device: 'iPhone 13',
    browser: 'Safari',
    ip: '172.56.21.1',
    location: 'San Francisco, CA',
    current: false,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: 'sess_3',
    device: 'Windows Desktop',
    browser: 'Edge 112',
    ip: '45.22.11.90',
    location: 'New York, NY',
    current: false,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

export const mockLoginHistory: LoginEvent[] = [
  { id: 'l1', date: new Date().toISOString(), location: 'San Francisco, CA', device: 'MacBook Pro', ip: '192.168.1.5', status: 'success' },
  { id: 'l2', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), location: 'San Francisco, CA', device: 'iPhone 13', ip: '172.56.21.1', status: 'success' },
  { id: 'l3', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), location: 'Moscow, RU', device: 'Unknown Device', ip: '195.2.4.11', status: 'blocked' },
  { id: 'l4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'New York, NY', device: 'Windows Desktop', ip: '45.22.11.90', status: 'success' },
];

export const mockSecurityEvents: SecurityEvent[] = [
  { id: 'se1', date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), type: 'login', description: 'New login from San Francisco, CA' },
  { id: 'se2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'password_change', description: 'Password changed successfully' },
  { id: 'se3', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), type: 'permission', description: 'API Key "Zapier Integration" generated' },
];

// API Functions
export async function fetchSecurityFactors(): Promise<SecurityScoreFactors> {
  await new Promise(r => setTimeout(r, 400));
  return { ...mockSecurityFactors };
}

export async function fetchActiveSessions(): Promise<ActiveSession[]> {
  await new Promise(r => setTimeout(r, 300));
  return [...mockSessions];
}

export async function fetchLoginHistory(): Promise<LoginEvent[]> {
  await new Promise(r => setTimeout(r, 450));
  return [...mockLoginHistory];
}

export async function fetchSecurityEvents(): Promise<SecurityEvent[]> {
  await new Promise(r => setTimeout(r, 350));
  return [...mockSecurityEvents];
}

export async function revokeSession(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 600));
  mockSessions = mockSessions.filter(s => s.id !== id);
}

export async function revokeAllOtherSessions(): Promise<void> {
  await new Promise(r => setTimeout(r, 800));
  mockSessions = mockSessions.filter(s => s.current);
}

export async function enable2FA(): Promise<string[]> {
  await new Promise(r => setTimeout(r, 1000));
  mockSecurityFactors.twoFactorEnabled = true;
  mockSecurityEvents.unshift({
    id: `se_${Date.now()}`,
    date: new Date().toISOString(),
    type: '2fa',
    description: 'Two-Factor Authentication enabled',
  });
  
  // Return backup codes
  return Array.from({ length: 10 }).map(() => faker.string.alphanumeric(8).toUpperCase());
}
