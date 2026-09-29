'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityScoreCard } from '@/components/security/security-score-card';
import { ActiveSessions } from '@/components/security/active-sessions';
import { LoginHistory } from '@/components/security/login-history';
import { SecurityEventsFeed } from '@/components/security/security-events-feed';
import { TwoFactorSetup } from '@/components/security/two-factor-setup';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, Settings as SettingsIcon, Bell, Key, Box, Users } from 'lucide-react';
import { GeneralSettings } from '@/components/settings/general-settings';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { TeamSettings } from '@/components/settings/team-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { ApiSettings } from '@/components/settings/api-settings';
import { IntegrationsSettings } from '@/components/settings/integrations-settings';

export default function SettingsPage() {
  const [twoFactorOpen, setTwoFactorOpen] = React.useState(false);

  return (
    <PageTransition>
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences, security, and integrations." 
      />
      
      <Tabs defaultValue="general" className="space-y-6 pb-10">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start inline-flex">
            <TabsTrigger value="general" className="flex items-center gap-2"><User className="h-4 w-4" /> General</TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2"><SettingsIcon className="h-4 w-4" /> Appearance</TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2"><Users className="h-4 w-4" /> Team</TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Security</TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2"><Key className="h-4 w-4" /> API</TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2"><Box className="h-4 w-4" /> Integrations</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-0"><GeneralSettings /></TabsContent>
        <TabsContent value="appearance" className="mt-0"><AppearanceSettings /></TabsContent>
        <TabsContent value="team" className="mt-0"><TeamSettings /></TabsContent>
        <TabsContent value="notifications" className="mt-0"><NotificationSettings /></TabsContent>
        <TabsContent value="api" className="mt-0"><ApiSettings /></TabsContent>
        <TabsContent value="integrations" className="mt-0"><IntegrationsSettings /></TabsContent>

        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setTwoFactorOpen(true)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Setup Two-Factor Auth
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1"><SecurityScoreCard /></div>
            <div className="lg:col-span-2"><ActiveSessions /></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoginHistory />
            <SecurityEventsFeed />
          </div>

          <TwoFactorSetup open={twoFactorOpen} onOpenChange={setTwoFactorOpen} />
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
