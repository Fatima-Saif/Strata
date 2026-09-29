'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { User, UserPlan, UserStatus, UserRole } from '@/lib/api/users';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoreHorizontal, ArrowUpDown, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/lib/api/users';
import { toast } from 'sonner';

// Reusable Status Badge Component
export const StatusBadge = ({ status }: { status: UserStatus }) => {
  switch (status) {
    case 'Active':
      return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25">Active</Badge>;
    case 'Inactive':
      return <Badge variant="secondary" className="text-muted-foreground border-border">Inactive</Badge>;
    case 'Pending':
      return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/25">Pending</Badge>;
  }
};

export const PlanBadge = ({ plan }: { plan: UserPlan }) => {
  switch (plan) {
    case 'Pro':
      return <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/25">Pro</Badge>;
    case 'Enterprise':
      return <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/20 hover:bg-purple-500/25">Enterprise</Badge>;
    case 'Free':
      return <Badge variant="outline" className="text-muted-foreground">Free</Badge>;
  }
};

// Inline Editor Component
const InlineEditor = ({ user, field, value, options }: { user: User, field: keyof User, value: string, options: string[] }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newValue: string) => updateUser(user.id, { [field]: newValue }),
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      
      // Optimistically update
      queryClient.setQueryData<User[]>(['users'], (old) => {
        if (!old) return [];
        return old.map(u => u.id === user.id ? { ...u, [field]: newValue } : u);
      });
      
      return { previousUsers };
    },
    onError: (err, newValue, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      toast.error(`Failed to update ${field}`);
    },
    onSuccess: (data) => {
      toast.success(`${field} updated successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="group flex items-center gap-2 cursor-pointer rounded px-2 py-1 -ml-2 hover:bg-muted/50 transition-colors">
        {field === 'status' ? <StatusBadge status={value as UserStatus} /> : 
         field === 'plan' ? <PlanBadge plan={value as UserPlan} /> : 
         <span className="text-sm">{value}</span>}
        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-1" align="start">
        <div className="flex flex-col space-y-1">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Update {field}</p>
          {options.map((opt) => (
            <Button
              key={opt}
              variant="ghost"
              size="sm"
              className="justify-start font-normal h-8"
              onClick={() => {
                mutation.mutate(opt);
                setOpen(false);
              }}
            >
              {opt}
              {value === opt && <span className="ml-auto flex h-2 w-2 rounded-full bg-primary" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-sm truncate max-w-[150px]">{row.getValue("company")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <InlineEditor 
          user={row.original} 
          field="status" 
          value={row.getValue("status")} 
          options={['Active', 'Inactive', 'Pending']} 
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      return (
        <InlineEditor 
          user={row.original} 
          field="plan" 
          value={row.getValue("plan")} 
          options={['Free', 'Pro', 'Enterprise']} 
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <InlineEditor 
          user={row.original} 
          field="role" 
          value={row.getValue("role")} 
          options={['Admin', 'Member', 'Viewer', 'Billing']} 
        />
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{format(new Date(row.getValue("joinedAt")), 'MMM d, yyyy')}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer profile</DropdownMenuItem>
            <DropdownMenuItem>Edit billing details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
