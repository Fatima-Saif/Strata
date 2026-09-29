'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCommandStore } from '@/lib/store/command-store';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandSeparator 
} from '@/components/ui/command';
import { 
  FileText, Users, LayoutDashboard, Settings, 
  CreditCard, PlusCircle, Search, Mail, Moon, Sun, Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { faker } from '@faker-js/faker';

// Mock data generator for entity search
const generateMockEntities = () => {
  faker.seed(123);
  return {
    users: Array.from({ length: 5 }).map(() => ({ id: faker.string.uuid(), name: faker.person.fullName(), email: faker.internet.email() })),
    invoices: Array.from({ length: 5 }).map(() => ({ id: faker.string.uuid(), title: `INV-${faker.number.int({min:1000, max:9999})}`, amount: faker.finance.amount() })),
    projects: Array.from({ length: 5 }).map(() => ({ id: faker.string.uuid(), title: faker.company.catchPhrase(), status: 'Active' }))
  };
};

const mockEntities = generateMockEntities();

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isOpen, setIsOpen, toggleOpen, recentItems, addRecentItem, openDialog } = useCommandStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Keyboard shortcut listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleOpen]);

  const runCommand = React.useCallback((command: () => void) => {
    setIsOpen(false);
    command();
  }, [setIsOpen]);

  const navigateTo = (href: string, label: string, type: string) => {
    runCommand(() => {
      addRecentItem({ id: href, label, type, href });
      router.push(href);
    });
  };

  const triggerAction = (actionId: 'inviteTeam' | 'createProject' | 'generateReport' | 'toggleTheme', label: string) => {
    runCommand(() => {
      addRecentItem({ id: actionId, label, type: 'Action', actionId });
      if (actionId === 'toggleTheme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      } else {
        openDialog(actionId as any);
      }
    });
  };

  // Filter mock entities based on search (simulate debounced API search)
  const query = searchQuery.toLowerCase();
  const filteredUsers = query ? mockEntities.users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) : [];
  const filteredInvoices = query ? mockEntities.invoices.filter(i => i.title.toLowerCase().includes(query)) : [];
  const filteredProjects = query ? mockEntities.projects.filter(p => p.title.toLowerCase().includes(query)) : [];

  const showEntityResults = filteredUsers.length > 0 || filteredInvoices.length > 0 || filteredProjects.length > 0;

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {!query && recentItems.length > 0 && (
          <CommandGroup heading="Recent">
            {recentItems.map((item) => (
              <CommandItem 
                key={item.id} 
                onSelect={() => item.href ? navigateTo(item.href, item.label, item.type) : triggerAction(item.actionId as any, item.label)}
              >
                {item.type === 'Navigation' ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigateTo('/dashboard', 'Dashboard', 'Navigation')}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigateTo('/users', 'Users & Roles', 'Navigation')}>
            <Users className="mr-2 h-4 w-4" /> Users & Roles
          </CommandItem>
          <CommandItem onSelect={() => navigateTo('/invoices', 'Invoices', 'Navigation')}>
            <CreditCard className="mr-2 h-4 w-4" /> Invoices
          </CommandItem>
          <CommandItem onSelect={() => navigateTo('/reports', 'Reports', 'Navigation')}>
            <FileText className="mr-2 h-4 w-4" /> Reports
          </CommandItem>
          <CommandItem onSelect={() => navigateTo('/settings', 'Settings', 'Navigation')}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => triggerAction('inviteTeam', 'Invite Team Member')}>
            <Mail className="mr-2 h-4 w-4" /> Invite Team Member
          </CommandItem>
          <CommandItem onSelect={() => triggerAction('createProject', 'Create Project')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Project
          </CommandItem>
          <CommandItem onSelect={() => triggerAction('generateReport', 'Generate Report')}>
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </CommandItem>
          <CommandItem onSelect={() => triggerAction('toggleTheme', 'Toggle Theme')}>
            <Monitor className="mr-2 h-4 w-4" /> Toggle Theme
          </CommandItem>
        </CommandGroup>

        {showEntityResults && <CommandSeparator />}

        {filteredUsers.length > 0 && (
          <CommandGroup heading="Users">
            {filteredUsers.map(user => (
              <CommandItem key={user.id} onSelect={() => navigateTo('/users', user.name, 'User')}>
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredInvoices.length > 0 && (
          <CommandGroup heading="Invoices">
            {filteredInvoices.map(inv => (
              <CommandItem key={inv.id} onSelect={() => navigateTo('/invoices', inv.title, 'Invoice')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{inv.title}</span>
                  <span className="text-xs text-muted-foreground">${inv.amount}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredProjects.length > 0 && (
          <CommandGroup heading="Projects">
            {filteredProjects.map(proj => (
              <CommandItem key={proj.id} onSelect={() => navigateTo('/projects', proj.title, 'Project')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{proj.title}</span>
                  <span className="text-xs text-muted-foreground">{proj.status}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
