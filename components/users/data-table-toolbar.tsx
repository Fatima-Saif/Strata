'use client';

import { Table } from '@tanstack/react-table';
import { X, Settings2, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUsers } from '@/lib/api/users';
import { toast } from 'sonner';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteUsers(ids),
    onSuccess: () => {
      toast.success(`${selectedRows.length} users deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      table.toggleAllRowsSelected(false);
    },
    onError: () => {
      toast.error('Failed to delete users.');
    }
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedRows.length} users?`)) {
      // @ts-ignore
      const ids = selectedRows.map(r => r.original.id);
      deleteMutation.mutate(ids);
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    // Generate export data from currently visible/filtered rows and columns
    const visibleColumns = table.getVisibleLeafColumns().filter(col => col.id !== 'select' && col.id !== 'actions');
    const exportData = table.getFilteredRowModel().rows.map(row => {
      const rowData: Record<string, any> = {};
      visibleColumns.forEach(col => {
        // @ts-ignore
        rowData[col.id] = row.getValue(col.id);
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    if (format === 'csv') {
      XLSX.writeFile(workbook, 'users_export.csv');
    } else {
      XLSX.writeFile(workbook, 'users_export.xlsx');
    }
    toast.success(`Exported ${exportData.length} rows to ${format.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border">
      <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
        <Input
          placeholder="Filter users..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-9 w-full sm:w-[250px] lg:w-[300px]"
        />
        
        {table.getColumn('status') && (
          <Select
            value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(val) => table.getColumn('status')?.setFilterValue(val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="h-9 w-[130px] hidden sm:flex border-dashed">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {table.getColumn('plan') && (
          <Select
            value={(table.getColumn('plan')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(val) => table.getColumn('plan')?.setFilterValue(val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="h-9 w-[130px] hidden lg:flex border-dashed">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
            </SelectContent>
          </Select>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-9 px-2 lg:px-3 text-muted-foreground"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 mr-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {selectedRows.length} selected
            </span>
            <Button variant="destructive" size="sm" className="h-9" onClick={handleDelete} disabled={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>Export to CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('xlsx')}>Export to Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ml-auto">
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
