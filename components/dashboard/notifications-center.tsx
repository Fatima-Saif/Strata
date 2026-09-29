'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, Search, X } from 'lucide-react';
import { useNotifications, NotificationCategory, AppNotification } from '@/store/use-notifications';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export function NotificationCenter() {
  const { notifications, unreadCount, markAllRead, markAsRead, removeNotification } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<NotificationCategory | 'All'>('All');

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                            n.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [notifications, search, categoryFilter]);

  const getCategoryColor = (category: NotificationCategory) => {
    switch(category) {
      case 'System': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Billing': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Security': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Updates': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Mentions': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full">
            {unreadCount}
          </Badge>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border">
        <SheetHeader className="p-6 border-b border-border text-left">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-8">
                <Check className="mr-2 h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 h-9 text-sm bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val as any)}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Updates">Updates</SelectItem>
                <SelectItem value="Mentions">Mentions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <Bell className="h-10 w-10 mb-4 opacity-20" />
              <p>No notifications found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border flex flex-col">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className={`p-4 hover:bg-muted/30 transition-colors flex gap-4 ${!notification.read ? 'bg-primary/5' : ''}`}
                      onMouseEnter={() => {
                        if (!notification.read) markAsRead(notification.id);
                      }}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="pt-2">
                          <Badge variant="outline" className={`text-[10px] uppercase border ${getCategoryColor(notification.category)}`}>
                            {notification.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
