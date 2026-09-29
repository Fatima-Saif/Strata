import { create } from 'zustand';

export type NotificationCategory = 'System' | 'Billing' | 'Security' | 'Updates' | 'Mentions';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  read: boolean;
  timestamp: Date;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isInitialized: boolean;
  fetchNotifications: (silent?: boolean) => Promise<void>;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => Promise<void>;
  markAllRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

// BroadcastChannel for instant zero-latency cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('strata_realtime_notifications');
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment');
  }
}

export const useNotifications = create<NotificationState>((set, get) => {
  // Listen for broadcasts from other tabs
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'REFETCH') {
        get().fetchNotifications(true);
      }
    };
  }

  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isInitialized: false,

    fetchNotifications: async (silent = false) => {
      if (!silent) set({ isLoading: true });
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const parsed = data.notifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          set({
            notifications: parsed,
            unreadCount: data.unreadCount ?? parsed.filter((n: any) => !n.read).length,
            isInitialized: true,
            isLoading: false,
          });
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
      } finally {
        if (!silent) set({ isLoading: false });
      }
    },

    addNotification: async (notif) => {
      // Optimistic local add
      const tempId = `temp-${Date.now()}`;
      const newNotif: AppNotification = {
        ...notif,
        id: tempId,
        read: false,
        timestamp: new Date(),
      };

      set((state) => {
        const updated = [newNotif, ...state.notifications];
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });

      try {
        const res = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notif),
        });
        const data = await res.json();
        if (data.success && data.notification) {
          // Replace temp id with real id from DB
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === tempId ? { ...data.notification, timestamp: new Date(data.notification.timestamp) } : n
            ),
          }));
          // Notify other open tabs/windows
          broadcastChannel?.postMessage({ type: 'REFETCH' });
        }
      } catch (e) {
        console.error('Error persisting notification to DB:', e);
      }
    },

    markAllRead: async () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));

      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ all: true }),
        });
        broadcastChannel?.postMessage({ type: 'REFETCH' });
      } catch (e) {
        console.error('Error marking all notifications as read:', e);
      }
    },

    markAsRead: async (id: string) => {
      set((state) => {
        const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });

      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, read: true }),
        });
        broadcastChannel?.postMessage({ type: 'REFETCH' });
      } catch (e) {
        console.error('Error marking notification read in DB:', e);
      }
    },

    removeNotification: async (id: string) => {
      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });

      try {
        await fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        broadcastChannel?.postMessage({ type: 'REFETCH' });
      } catch (e) {
        console.error('Error removing notification in DB:', e);
      }
    },

    clearAll: async () => {
      set({
        notifications: [],
        unreadCount: 0,
      });

      try {
        await fetch('/api/notifications?all=true', {
          method: 'DELETE',
        });
        broadcastChannel?.postMessage({ type: 'REFETCH' });
      } catch (e) {
        console.error('Error clearing notifications in DB:', e);
      }
    },
  };
});
