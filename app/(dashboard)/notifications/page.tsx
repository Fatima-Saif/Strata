'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { useNotifications, NotificationCategory } from '@/store/use-notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ShieldAlert, 
  CreditCard, 
  MessageSquare, 
  Cpu, 
  Sparkles,
  Clock,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAllRead, 
    markAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const filtered = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'unread') return !n.read;
    return n.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Security':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'Billing':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'Mentions':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'System':
        return <Cpu className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-sky-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
        <PageHeader 
          title="Notifications & Activity" 
          description="Real-time alerts, system updates, billing events, and team communications."
          action={
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  markAllRead();
                  toast.success('All notifications marked as read.');
                }}
                disabled={unreadCount === 0}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearAll();
                  toast.info('Notification feed cleared.');
                }}
                disabled={notifications.length === 0}
                className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </Button>
            </div>
          }
        />

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'security', label: 'Security' },
            { id: 'billing', label: 'Billing' },
            { id: 'mentions', label: 'Mentions' },
            { id: 'system', label: 'System' },
          ].map(tab => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeCategory === tab.id ? 'default' : 'secondary'}
              onClick={() => setActiveCategory(tab.id)}
              className="rounded-full text-xs h-8 gap-1.5 cursor-pointer shrink-0"
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeCategory === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/20 text-foreground'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  !notif.read 
                    ? 'bg-card border-indigo-500/30 shadow-xs' 
                    : 'bg-card/60 border-border opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                    !notif.read ? 'bg-indigo-500/10' : 'bg-muted'
                  }`}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-foreground">
                        {notif.title}
                      </h4>
                      <Badge variant="outline" className="text-[10px] font-mono py-0">
                        {notif.category}
                      </Badge>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(notif.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs h-7 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    >
                      Mark read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeNotification(notif.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-base">You're all caught up!</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                No active notifications in this category. New events will appear here in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
