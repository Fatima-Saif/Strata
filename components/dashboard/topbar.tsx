'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/dashboard/notifications-center';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/store/use-sidebar';
import { useCommandStore } from '@/lib/store/command-store';

import { useSession, signOut } from 'next-auth/react';

export function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { toggleOpen } = useCommandStore();
  const { data: session } = useSession();

  const userName = session?.user?.name || 'Administrator';
  const userEmail = session?.user?.email || 'admin@strata.ops';
  const userRole = (session?.user as any)?.role || 'Admin';
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';
  
  // Create breadcrumb from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ') || 'Overview';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="flex-1">
        <h1 className="text-sm font-medium text-muted-foreground hidden md:block">
          {breadcrumb}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <Button 
          variant="outline" 
          onClick={toggleOpen}
          aria-label="Search"
          className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Notifications */}
        <NotificationCenter />

        <ThemeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button aria-label="User Menu" variant="ghost" className="relative h-9 w-9 rounded-full ring-1 ring-border" />}>
            <Avatar className="h-9 w-9 bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold leading-none text-foreground">{userName}</p>
                  <Badge variant="outline" className="text-[10px] py-0 font-mono">{userRole}</Badge>
                </div>
                <p className="text-xs leading-none text-muted-foreground truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings" className="cursor-pointer">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/revenue" className="cursor-pointer">Billing</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/help" className="cursor-pointer">Support & Docs</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive font-medium cursor-pointer focus:text-destructive focus:bg-destructive/10"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
