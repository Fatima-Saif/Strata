'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Mail, Smartphone, MessageSquare, Bell } from 'lucide-react';

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'push', label: 'Push Notification', icon: Bell },
  { id: 'sms', label: 'SMS', icon: Smartphone },
  { id: 'slack', label: 'Slack', icon: MessageSquare },
  { id: 'discord', label: 'Discord', icon: MessageSquare },
] as const;

const CATEGORIES = [
  { id: 'system', label: 'System Alerts' },
  { id: 'billing', label: 'Billing & Invoices' },
  { id: 'security', label: 'Security & Logins' },
  { id: 'updates', label: 'Product Updates' },
  { id: 'mentions', label: 'Comments & Mentions' },
] as const;

export function NotificationSettings() {
  const store = useSettingsStore();

  const handleSave = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how and when you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 overflow-x-auto">
          {CHANNELS.map((channel) => {
            const channelData = store.notifications[channel.id];
            const Icon = channel.icon;
            
            return (
              <div key={channel.id} className="space-y-4 min-w-[600px]">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-base">{channel.label}</h3>
                  </div>
                  <Switch 
                    checked={channelData.enabled} 
                    onCheckedChange={(checked) => store.toggleNotificationChannel(channel.id, checked)}
                  />
                </div>
                
                <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 pt-2 ${!channelData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  {CATEGORIES.map(category => (
                    <div key={category.id} className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-muted-foreground">{category.label}</span>
                      <Switch 
                        checked={channelData.categories[category.id]}
                        onCheckedChange={(checked) => store.toggleNotificationCategory(channel.id, category.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
