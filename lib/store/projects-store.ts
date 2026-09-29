import { create } from 'zustand';
import { faker } from '@faker-js/faker';

export type ProjectStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Done';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  assignees: { name: string; avatar: string }[];
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc' | 'code';
}

export interface ProjectComment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  members: { name: string; avatar: string }[];
  tasks: ProjectTask[];
  files: ProjectFile[];
  comments: ProjectComment[];
}

// Generate initial mock data
faker.seed(111);

const generateMembers = (count: number) => Array.from({ length: count }).map(() => ({
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
}));

const generateTasks = (count: number): ProjectTask[] => Array.from({ length: count }).map(() => ({
  id: faker.string.uuid(),
  title: faker.hacker.phrase(),
  completed: faker.datatype.boolean(),
  assignees: generateMembers(faker.number.int({ min: 1, max: 2 })),
}));

const generateFiles = (count: number): ProjectFile[] => Array.from({ length: count }).map(() => ({
  id: faker.string.uuid(),
  name: `${faker.system.fileName()}.${faker.helpers.arrayElement(['pdf', 'jpg', 'docx', 'ts'])}`,
  size: `${faker.number.int({ min: 10, max: 5000 })} KB`,
  type: faker.helpers.arrayElement(['pdf', 'image', 'doc', 'code']),
}));

const enterpriseProjectTemplates = [
  {
    title: 'Zero-Downtime PostgreSQL to LibSQL Database Migration',
    description: 'Execute blue-green schema synchronisation and dual-write replication pipeline with zero packet loss.',
    priority: 'Urgent' as ProjectPriority,
    status: 'In Progress' as ProjectStatus,
  },
  {
    title: 'Multi-Tenant RBAC & SOC2 Type II Audit Logging',
    description: 'Implement immutable distributed audit trails, scoped API keys, and session lifecycle monitoring.',
    priority: 'High' as ProjectPriority,
    status: 'In Review' as ProjectStatus,
  },
  {
    title: 'Global Edge API Gateway & Cache Invalidation Engine',
    description: 'Optimize Cloudflare Worker edges to deliver sub-50ms TTFB across North America, EU, and APAC.',
    priority: 'Medium' as ProjectPriority,
    status: 'Backlog' as ProjectStatus,
  },
  {
    title: 'Automated Stripe Metered Billing & Webhook Handlers',
    description: 'Reconcile hourly seat usage, overage calculation, and asynchronous invoice dispute resolution.',
    priority: 'Urgent' as ProjectPriority,
    status: 'Done' as ProjectStatus,
  },
  {
    title: 'Kubernetes Cluster Auto-Scaling & Egress Cost Reduction',
    description: 'Tune HPA metrics, spot instance bidding, and inter-AZ network egress bandwidth.',
    priority: 'Low' as ProjectPriority,
    status: 'In Progress' as ProjectStatus,
  },
  {
    title: 'OpenTelemetry Distributed Tracing & Sentry V2 Upgrade',
    description: 'Standardize span contexts across microservices, cron workers, and database query transactions.',
    priority: 'Medium' as ProjectPriority,
    status: 'Done' as ProjectStatus,
  },
  {
    title: 'GraphQL Federation & Core Data Schema Unification',
    description: 'Deprecate legacy REST endpoints in favor of a single federated supergraph with Apollo Router.',
    priority: 'Low' as ProjectPriority,
    status: 'Backlog' as ProjectStatus,
  },
  {
    title: 'Single Sign-On (SSO) Okta & Azure AD SAML 2.0 Integration',
    description: 'Deliver enterprise identity provider provisioning with SCIM directory user syncing.',
    priority: 'High' as ProjectPriority,
    status: 'In Review' as ProjectStatus,
  },
  {
    title: 'CI/CD Pipeline Parallelization & Docker Layer Caching',
    description: 'Reduce GitHub Actions run times from 24 minutes to under 4 minutes with Turborepo remote cache.',
    priority: 'Low' as ProjectPriority,
    status: 'Done' as ProjectStatus,
  },
  {
    title: 'Real-time WebSocket Collaborative Cursor & Presence Sync',
    description: 'Implement operational transformation and CRDT algorithms for multi-user document collaboration.',
    priority: 'Medium' as ProjectPriority,
    status: 'Backlog' as ProjectStatus,
  },
  {
    title: 'Cross-Border VAT & European Tax Compliance Automation',
    description: 'Integrate TaxJar / Avalara tax recalculation engines for automated reverse-charge invoice items.',
    priority: 'Low' as ProjectPriority,
    status: 'Backlog' as ProjectStatus,
  },
  {
    title: 'High-Volume Async Email Pipeline via AWS SES & SendGrid',
    description: 'Implement exponential backoff queues, DKIM/SPF rotation, and bounce rate quarantine monitoring.',
    priority: 'Medium' as ProjectPriority,
    status: 'Done' as ProjectStatus,
  },
];

const sampleCommentSnippets = [
  'Pull request is up for review with unit and integration tests passing.',
  'Staging deployment verified on cluster-us-east-1. Moving to review.',
  'Performance benchmark showed a 42% decrease in latency under load.',
  'Dependencies upgraded and security advisory vulnerability patched.',
  'Documentation and OpenAPI specifications updated accordingly.',
];

const generateComments = (count: number): ProjectComment[] => Array.from({ length: count }).map(() => ({
  id: faker.string.uuid(),
  author: generateMembers(1)[0],
  content: faker.helpers.arrayElement(sampleCommentSnippets),
  createdAt: faker.date.recent({ days: 7 }).toISOString(),
}));

const initialProjects: Project[] = enterpriseProjectTemplates.map((template, idx) => ({
  id: `proj-${idx + 1}`,
  title: template.title,
  description: template.description,
  status: template.status,
  priority: template.priority,
  dueDate: faker.date.soon({ days: 15 + idx * 3 }).toISOString(),
  members: generateMembers(faker.number.int({ min: 2, max: 4 })),
  tasks: generateTasks(faker.number.int({ min: 4, max: 8 })),
  files: generateFiles(faker.number.int({ min: 1, max: 4 })),
  comments: generateComments(faker.number.int({ min: 1, max: 4 })),
}));

// Guarantee first project is due soon for notification checking
initialProjects[0].dueDate = new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString();
initialProjects[0].title = 'Urgent Security Patch & Kernel Vulnerability Fix';
initialProjects[0].status = 'In Progress';
initialProjects[0].priority = 'Urgent';

interface ProjectsState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'files' | 'comments'>) => void;
  updateProjectStatus: (id: string, newStatus: ProjectStatus) => void;
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
  addComment: (projectId: string, content: string, author: { name: string; avatar: string }) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: initialProjects,
  addProject: (p) => set((state) => ({
    projects: [{
      ...p,
      id: Math.random().toString(),
      tasks: [],
      files: [],
      comments: [],
    }, ...state.projects]
  })),
  updateProjectStatus: (id, newStatus) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, status: newStatus } : p)
  })),
  toggleTaskCompletion: (projectId, taskId) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? {
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    } : p)
  })),
  addComment: (projectId, content, author) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? {
      ...p,
      comments: [...p.comments, { id: Math.random().toString(), author, content, createdAt: new Date().toISOString() }]
    } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
}));

export const calculateProgress = (tasks: ProjectTask[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
};
