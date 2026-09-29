'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function GeneralSettings() {
  const store = useSettingsStore();
  const [companyName, setCompanyName] = React.useState(store.companyName);
  const [timezone, setTimezone] = React.useState(store.timezone);
  const [language, setLanguage] = React.useState(store.language);
  const [currency, setCurrency] = React.useState(store.currency);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(store.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    store.updateGeneral({ companyName, timezone, language, currency, logoUrl });
    toast.success('General settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your company's basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Logo</span>
                )}
              </div>
              <div className="space-y-2">
                <Input type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-xs" />
                <p className="text-xs text-muted-foreground">Recommended size: 256x256px. Max 2MB.</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 max-w-md">
            <Label>Company Name</Label>
            <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>Configure regional settings for your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={v => v && setTimezone(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={v => v && setLanguage(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={v => v && setCurrency(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
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
