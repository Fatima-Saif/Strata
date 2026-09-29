'use client';

import * as React from 'react';
import { useReportEngineStore, ReportType } from '@/lib/store/report-engine-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export-utils';

const AVAILABLE_METRICS = {
  Revenue: ['Total Revenue', 'Recurring Revenue', 'Profit Margin'],
  Users: ['Active Users', 'New Signups', 'Churned Users'],
  Subscriptions: ['Active Subscriptions', 'Cancellations', 'Upgrades'],
  Security: ['Login Attempts', 'Failed Logins', '2FA Adoptions'],
};

// Mock data generator for preview
const generateMockData = (metrics: string[]) => {
  return Array.from({ length: 6 }).map((_, i) => {
    const row: any = { name: `Month ${i + 1}` };
    metrics.forEach(m => {
      row[m] = Math.floor(Math.random() * 5000) + 1000;
    });
    return row;
  });
};

export function ReportBuilder() {
  const { currentConfig, setConfig } = useReportEngineStore();

  const handleTypeChange = (val: ReportType) => {
    setConfig({ 
      type: val, 
      metrics: val === 'Custom' ? [] : [AVAILABLE_METRICS[val as keyof typeof AVAILABLE_METRICS]?.[0] || '']
    });
  };

  const handleMetricToggle = (metric: string) => {
    const metrics = [...currentConfig.metrics];
    if (metrics.includes(metric)) {
      setConfig({ metrics: metrics.filter(m => m !== metric) });
    } else {
      setConfig({ metrics: [...metrics, metric] });
    }
  };

  const activeMetricsList = currentConfig.type === 'Custom' 
    ? Object.values(AVAILABLE_METRICS).flat() 
    : AVAILABLE_METRICS[currentConfig.type as keyof typeof AVAILABLE_METRICS] || [];

  const previewData = React.useMemo(() => generateMockData(currentConfig.metrics), [currentConfig]);

  const handleExportCSV = () => exportToCSV(previewData, `report_${currentConfig.type}`);
  const handleExportExcel = () => exportToExcel(previewData, `report_${currentConfig.type}`);
  const handleExportPDF = () => exportToPDF('report-preview-pane');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Pane: Controls */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Report Builder</CardTitle>
          <CardDescription>Configure report parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={currentConfig.type} onValueChange={(val) => handleTypeChange(val as ReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Users">Users</SelectItem>
                <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={currentConfig.dateRange.start.split('T')[0]} 
                onChange={e => setConfig({ dateRange: { ...currentConfig.dateRange, start: new Date(e.target.value).toISOString() }})} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={currentConfig.dateRange.end.split('T')[0]} 
                onChange={e => setConfig({ dateRange: { ...currentConfig.dateRange, end: new Date(e.target.value).toISOString() }})} 
                min={currentConfig.dateRange.start.split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Metrics to Include</Label>
            <div className="space-y-2 border rounded-md p-4">
              {activeMetricsList.map(metric => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`metric-${metric}`} 
                    checked={currentConfig.metrics.includes(metric)}
                    onCheckedChange={() => handleMetricToggle(metric)}
                  />
                  <label htmlFor={`metric-${metric}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {metric}
                  </label>
                </div>
              ))}
              {activeMetricsList.length === 0 && <div className="text-sm text-muted-foreground">No metrics available.</div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Pane: Preview */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>{currentConfig.type} Report ({currentConfig.metrics.length} metrics)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
          </div>
        </CardHeader>
        <CardContent id="report-preview-pane">
          {currentConfig.metrics.length > 0 ? (
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={previewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  {currentConfig.metrics.map((metric, idx) => (
                    <Bar 
                      key={metric} 
                      dataKey={metric} 
                      fill={`hsl(var(--primary) / ${1 - idx * 0.2})`} 
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md mt-4">
              Select at least one metric to generate a preview.
            </div>
          )}

          {currentConfig.metrics.length > 0 && (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-md">Period</th>
                    {currentConfig.metrics.map((metric, i) => (
                      <th key={metric} className={`px-4 py-3 ${i === currentConfig.metrics.length - 1 ? 'rounded-tr-md' : ''}`}>{metric}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      {currentConfig.metrics.map(metric => (
                        <td key={metric} className="px-4 py-3">{row[metric]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
