export type Role = 'Admin' | 'Manager' | 'Developer' | 'Viewer';

/**
 * Represents a user of the dashboard application
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Represents a subscription plan
 */
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
}

/**
 * Represents a customer / organization
 */
export interface Customer {
  id: string;
  company: string;
  contactName: string;
  email: string;
  plan: Plan;
  status: 'active' | 'churned' | 'trialing';
  joinedAt: string;
  country: string;
}

/**
 * Represents a billing invoice
 */
export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issuedAt: string;
  dueDate: string;
}

/**
 * Represents a customer's subscription
 */
export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

/**
 * Represents a project within a customer's workspace
 */
export interface Project {
  id: string;
  customerId: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  progress: number; // 0 to 100
  createdAt: string;
}

/**
 * Represents a system or user notification
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Represents an audit/activity event
 */
export interface ActivityEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
}

/**
 * Represents a security-related event (login, password change, etc.)
 */
export interface SecurityEvent {
  id: string;
  userId: string;
  eventType: 'login_success' | 'login_failed' | 'password_changed' | 'mfa_enabled';
  ipAddress: string;
  timestamp: string;
}
