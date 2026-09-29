'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Table as TableIcon, BarChart2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ChartWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  data: any[];
  columns: { key: string; label: string; format?: (val: any) => string }[];
  className?: string;
}

export function ChartWrapper({ title, description, children, data, columns, className }: ChartWrapperProps) {
  const [view, setView] = React.useState<'chart' | 'table'>('chart');
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (chartRef.current === null) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: 'var(--background)' });
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast({
        title: 'Success',
        description: 'Chart downloaded successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to download chart.',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (chartRef.current === null) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: 'var(--background)' });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast({
        title: 'Success',
        description: 'Chart copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy chart. Try downloading instead.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-1 border rounded-md p-1 bg-muted/50">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setView(view === 'chart' ? 'table' : 'chart')} title={view === 'chart' ? "View as Table" : "View as Chart"}>
            {view === 'chart' ? <TableIcon className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} title="Copy to Clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownload} title="Download as PNG">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'chart' ? (
          <div ref={chartRef} className="pt-2 pb-1 bg-background rounded-md">
            {children}
          </div>
        ) : (
          <div className="h-[350px] overflow-auto pt-4 rounded-md border mt-2">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {columns.map(col => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.format ? col.format(row[col.key]) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
