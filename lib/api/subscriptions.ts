export type PlanName = 'Free' | 'Starter' | 'Professional' | 'Business' | 'Enterprise';

export interface PlanTier {
  name: PlanName;
  price: number;
  interval: 'month' | 'year';
  description: string;
  popular: boolean;
  limits: {
    storageGb: number;
    members: number;
    apiRequests: number;
  };
  features: string[];
}

export const PLAN_TIERS: PlanTier[] = [
  {
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Perfect for individuals and small side projects.',
    popular: false,
    limits: {
      storageGb: 1,
      members: 1,
      apiRequests: 1000,
    },
    features: [
      'Up to 1 project',
      'Basic analytics',
      'Community support',
      '48-hour data retention'
    ]
  },
  {
    name: 'Starter',
    price: 19,
    interval: 'month',
    description: 'Great for small teams starting to scale.',
    popular: false,
    limits: {
      storageGb: 10,
      members: 5,
      apiRequests: 10000,
    },
    features: [
      'Up to 5 projects',
      'Advanced analytics',
      'Email support',
      '30-day data retention',
      'Custom domains'
    ]
  },
  {
    name: 'Professional',
    price: 49,
    interval: 'month',
    description: 'The standard for growing professional teams.',
    popular: true,
    limits: {
      storageGb: 50,
      members: 15,
      apiRequests: 50000,
    },
    features: [
      'Unlimited projects',
      'Custom reporting',
      'Priority email support',
      '1-year data retention',
      'Custom domains',
      'Team roles & permissions'
    ]
  },
  {
    name: 'Business',
    price: 99,
    interval: 'month',
    description: 'Advanced security and support for larger organizations.',
    popular: false,
    limits: {
      storageGb: 200,
      members: 50,
      apiRequests: 250000,
    },
    features: [
      'Everything in Professional',
      'SSO (SAML)',
      'Audit logs',
      'Priority phone support',
      'Dedicated account manager',
      'Unlimited data retention'
    ]
  },
  {
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    description: 'Maximum performance and custom SLAs for enterprise.',
    popular: false,
    limits: {
      storageGb: 1000, // 1TB
      members: 500, // virtually unlimited for UI
      apiRequests: 2000000,
    },
    features: [
      'Everything in Business',
      'Custom SLA',
      'On-premise deployment option',
      'Custom API rate limits',
      'White-labeling',
      '24/7 priority support'
    ]
  }
];

export interface TenantUsage {
  currentPlan: PlanName;
  storageUsed: number;
  membersCount: number;
  apiRequestsCount: number;
}

// Global mock state for the current tenant's usage
let currentTenantUsage: TenantUsage = {
  currentPlan: 'Starter',
  storageUsed: 8.5, // 85% of 10GB limit
  membersCount: 4,  // 80% of 5 limit
  apiRequestsCount: 9200, // 92% of 10000 limit
};

export async function fetchPlans(): Promise<PlanTier[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return PLAN_TIERS;
}

export async function fetchTenantUsage(): Promise<TenantUsage> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...currentTenantUsage };
}

export async function updateTenantPlan(newPlan: PlanName): Promise<TenantUsage> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  currentTenantUsage.currentPlan = newPlan;
  return { ...currentTenantUsage };
}
