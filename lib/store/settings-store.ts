import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationChannels = 'email' | 'push' | 'sms' | 'slack' | 'discord';
type NotificationCategories = 'system' | 'billing' | 'security' | 'updates' | 'mentions';

interface SettingsState {
  // General
  companyName: string;
  timezone: string;
  language: string;
  currency: string;
  logoUrl: string | null;
  updateGeneral: (updates: Partial<Pick<SettingsState, 'companyName' | 'timezone' | 'language' | 'currency' | 'logoUrl'>>) => void;

  // Appearance
  accentColor: string; // HSL string
  compactMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  sidebarStyle: 'expanded' | 'compact';
  updateAppearance: (updates: Partial<Pick<SettingsState, 'accentColor' | 'compactMode' | 'fontSize' | 'sidebarStyle'>>) => void;

  // Notifications
  notifications: Record<NotificationChannels, {
    enabled: boolean;
    categories: Record<NotificationCategories, boolean>;
  }>;
  toggleNotificationChannel: (channel: NotificationChannels, enabled: boolean) => void;
  toggleNotificationCategory: (channel: NotificationChannels, category: NotificationCategories, enabled: boolean) => void;

  // API Settings
  apiKeys: { id: string; name: string; key: string; createdAt: string; lastUsed: string }[];
  webhookUrl: string;
  updateWebhookUrl: (url: string) => void;
  generateApiKey: (name: string) => void;
  deleteApiKey: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      companyName: 'Acme Corp',
      timezone: 'UTC',
      language: 'en-US',
      currency: 'USD',
      logoUrl: null,
      updateGeneral: (updates) => set((state) => ({ ...state, ...updates })),

      accentColor: '240 5.9% 10%', // Default zinc
      compactMode: false,
      fontSize: 'medium',
      sidebarStyle: 'expanded',
      updateAppearance: (updates) => set((state) => ({ ...state, ...updates })),

      notifications: {
        email: { enabled: true, categories: { system: true, billing: true, security: true, updates: false, mentions: true } },
        push: { enabled: true, categories: { system: true, billing: false, security: true, updates: false, mentions: true } },
        sms: { enabled: false, categories: { system: false, billing: false, security: true, updates: false, mentions: false } },
        slack: { enabled: false, categories: { system: false, billing: false, security: false, updates: false, mentions: false } },
        discord: { enabled: false, categories: { system: false, billing: false, security: false, updates: false, mentions: false } },
      },
      toggleNotificationChannel: (channel, enabled) => set((state) => ({
        notifications: {
          ...state.notifications,
          [channel]: { ...state.notifications[channel], enabled }
        }
      })),
      toggleNotificationCategory: (channel, category, enabled) => set((state) => ({
        notifications: {
          ...state.notifications,
          [channel]: {
            ...state.notifications[channel],
            categories: { ...state.notifications[channel].categories, [category]: enabled }
          }
        }
      })),

      apiKeys: [
        { id: '1', name: 'Production Key', key: 'sk_live_123456789', createdAt: new Date(Date.now() - 30*86400000).toISOString(), lastUsed: new Date().toISOString() },
        { id: '2', name: 'Staging Key', key: 'sk_test_987654321', createdAt: new Date(Date.now() - 60*86400000).toISOString(), lastUsed: new Date(Date.now() - 86400000).toISOString() }
      ],
      webhookUrl: 'https://api.acmecorp.com/webhooks',
      updateWebhookUrl: (url) => set({ webhookUrl: url }),
      generateApiKey: (name) => set((state) => ({
        apiKeys: [...state.apiKeys, {
          id: Math.random().toString(),
          name,
          key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
          createdAt: new Date().toISOString(),
          lastUsed: 'Never'
        }]
      })),
      deleteApiKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.filter(k => k.id !== id)
      })),
    }),
    {
      name: 'settings-store'
    }
  )
);
