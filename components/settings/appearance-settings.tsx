'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ACCENT_COLORS = [
  { name: 'Zinc', hsl: '240 5.9% 10%' },
  { name: 'Blue', hsl: '221.2 83.2% 53.3%' },
  { name: 'Violet', hsl: '262.1 83.3% 57.8%' },
  { name: 'Green', hsl: '142.1 76.2% 36.3%' },
  { name: 'Orange', hsl: '24.6 95% 53.1%' },
  { name: 'Rose', hsl: '346.8 77.2% 49.8%' },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const store = useSettingsStore();
  
  const [accentColor, setAccentColor] = React.useState(store.accentColor);
  const [compactMode, setCompactMode] = React.useState(store.compactMode);
  const [fontSize, setFontSize] = React.useState(store.fontSize);
  const [sidebarStyle, setSidebarStyle] = React.useState(store.sidebarStyle);

  const handleSave = () => {
    store.updateAppearance({ accentColor, compactMode, fontSize, sidebarStyle });
    toast.success('Appearance settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the look and feel of your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Color Mode</Label>
                <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
              </div>
              <Select value={theme || 'system'} onValueChange={(v) => v && setTheme(v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4">
              <div className="space-y-0.5">
                <Label>Accent Color</Label>
                <p className="text-sm text-muted-foreground">Choose a primary brand color.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.name}
                    title={color.name}
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${accentColor === color.hsl ? 'border-foreground' : 'border-transparent'}`}
                    style={{ backgroundColor: `hsl(${color.hsl})` }}
                    onClick={() => setAccentColor(color.hsl)}
                  >
                    {accentColor === color.hsl && <span className="text-white drop-shadow-md text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Options</CardTitle>
          <CardDescription>Adjust density and layout styles to fit your workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce padding in tables and cards to see more data at once.</p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Sidebar Style</Label>
                <p className="text-sm text-muted-foreground">Default sidebar behavior.</p>
              </div>
              <Select value={sidebarStyle} onValueChange={(v: any) => v && setSidebarStyle(v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="compact">Compact (Icons)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
