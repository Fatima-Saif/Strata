'use client';

import * as React from 'react';
import { useNotifications, NotificationCategory } from '@/store/use-notifications';
import { toast } from 'sonner';

const REALTIME_SYSTEM_EVENTS = [
  { title: 'Payment Settled', desc: 'Received $240.00 from Stripe subscription.', category: 'Billing' as NotificationCategory },
  { title: 'Continuous Integration Passed', desc: 'Build #1084 passed all automated tests.', category: 'Updates' as NotificationCategory },
  { title: 'Security Token Rotated', desc: 'API gateway keys rotated successfully.', category: 'Security' as NotificationCategory },
  { title: 'Database Snapshot Saved', desc: 'Daily backup stored in multi-region replica.', category: 'System' as NotificationCategory },
  { title: 'New Customer Signup', desc: 'A new enterprise user joined your workspace.', category: 'System' as NotificationCategory },
];

export function MockNotificationSimulator() {
  const { fetchNotifications, addNotification, notifications, isInitialized } = useNotifications();
  const knownIdsRef = React.useRef<Set<string>>(new Set());

  // 1. Initial load
  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 2. Track known notifications and toast on new arrivals
  React.useEffect(() => {
    if (!isInitialized) return;

    if (knownIdsRef.current.size === 0) {
      // First hydration, populate known IDs without toasting existing ones
      notifications.forEach((n) => knownIdsRef.current.add(n.id));
      return;
    }

    // Check for newly arrived notifications
    notifications.forEach((n) => {
      if (!knownIdsRef.current.has(n.id)) {
        knownIdsRef.current.add(n.id);
        // Only toast if it was created in the last 2 minutes
        const ageMs = Date.now() - new Date(n.timestamp).getTime();
        if (ageMs < 120000) {
          toast(n.title, {
            description: n.description,
            action: {
              label: 'Dismiss',
              onClick: () => {},
            },
          });
        }
      }
    });
  }, [notifications, isInitialized]);

  // 3. Real-time polling every 6 seconds to keep multi-user / multi-tab sessions in sync
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 6000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // 4. Background realistic enterprise events every 45-75 seconds
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 30000) + 45000;
      timeoutId = setTimeout(() => {
        const event = REALTIME_SYSTEM_EVENTS[Math.floor(Math.random() * REALTIME_SYSTEM_EVENTS.length)];
        addNotification({
          title: event.title,
          description: event.desc,
          category: event.category,
        });
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [addNotification]);

  return null;
}
