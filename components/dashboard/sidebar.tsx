'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { springTransition, easeOutTransition } from '@/lib/motion';
import { useSidebar } from '@/store/use-sidebar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart,
  Users,
  UserCog,
  Briefcase,
  DollarSign,
  FileText,
  Repeat,
  FileBarChart,
  Bell,
  UsersRound,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDownIcon,
  Terminal,
  LayoutTemplate,
  Globe,
} from 'lucide-react';
import { StrataLogo } from '@/components/ui/brand-logo';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const routes = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Users', href: '/users', icon: UserCog },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Subscriptions', href: '/subscriptions', icon: Repeat },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Templates', href: '/templates', icon: LayoutTemplate },
  { name: 'API Usage', href: '/api', icon: Terminal },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Team', href: '/team', icon: UsersRound },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Wait for hydration to avoid mismatch on collapse state

  const primaryMobileRoutes = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Invoices', href: '/invoices', icon: FileText },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={springTransition}
        className="hidden md:flex relative flex-col h-full bg-muted/30 border-r border-border shrink-0 z-20 overflow-hidden"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={easeOutTransition}
                className="font-bold text-xl tracking-tight truncate whitespace-nowrap"
              >
                <Link href="/" className="hover:opacity-90 transition-opacity flex items-center" title="View Public Website">
                  <StrataLogo />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto shrink-0"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
            const Icon = route.icon;

            return (
              <Tooltip key={route.href}>
                <TooltipTrigger render={<Link href={route.href} />}>
                  <div
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-indigo-600 text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                      isCollapsed && "justify-center px-0 py-2"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={easeOutTransition}
                          className="truncate whitespace-nowrap"
                        >
                          {route.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {route.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>

        <div className="p-3 border-t border-border space-y-1">
          <Tooltip>
            <TooltipTrigger render={<Link href="/" />}>
              <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10 font-medium transition-all", isCollapsed && "justify-center px-0")}>
                <Globe className="h-5 w-5 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={easeOutTransition}
                      className="ml-0.5 truncate whitespace-nowrap"
                    >
                      Website Home
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Website Home
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={
              <Button 
                aria-label="Logout" 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className={cn("w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer", isCollapsed && "justify-center px-0")} 
              />
            }>
              <LogOut className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={easeOutTransition}
                    className="ml-3 truncate whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>

          {!isCollapsed && (
            <div className="pt-2 px-1 text-[11px] text-muted-foreground/80 flex items-center justify-center gap-1 border-t border-border/50 mt-1">
              <span>Powered by</span>
              <a
                href="https://falconface.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground tracking-tight hover:underline hover:text-primary transition-colors ml-0.5"
              >
                FalconFace
              </a>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
        {primaryMobileRoutes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{route.name}</span>
            </Link>
          );
        })}

        {/* Mobile Menu Trigger (Drawer could be added here, for now using basic trigger) */}
        <button
          onClick={toggleSidebar} // We can reuse the toggle state to open a full screen mobile menu if desired
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="More Options"
        >
          <div className="flex flex-col gap-[3px] items-center justify-center h-5 w-5">
            <span className="w-4 h-[2px] bg-current rounded-full" />
            <span className="w-4 h-[2px] bg-current rounded-full" />
            <span className="w-4 h-[2px] bg-current rounded-full" />
          </div>
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </div>
      
      {/* Mobile Full Screen Menu Overlay (when 'More' is clicked) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={springTransition}
            className="md:hidden fixed inset-0 z-40 bg-background flex flex-col pt-4 pb-20 overflow-y-auto"
          >
            <div className="px-4 pb-4 border-b border-border mb-2 flex items-center justify-between">
              <span className="font-bold text-lg tracking-tight">Strata Workspace</span>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close Menu">
                <ChevronDownIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 px-4 space-y-1">
              <Link
                href="/"
                onClick={toggleSidebar}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all font-semibold text-primary bg-primary/10 border border-primary/20 mb-2"
              >
                <Globe className="h-5 w-5" />
                <span>Back to Website Home</span>
              </Link>
              {routes.map((route) => {
                const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={toggleSidebar}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all font-medium",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground active:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{route.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
