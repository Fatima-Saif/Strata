import * as React from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { OnboardingWizard } from '@/components/dashboard/onboarding-wizard';
import { MockNotificationSimulator } from '@/components/dashboard/mock-notification-simulator';
import dynamic from 'next/dynamic';
import { GlobalDialogs } from '@/components/layout/global-dialogs';

const CommandPalette = dynamic(() => import('@/components/layout/command-palette').then(mod => mod.CommandPalette));
import { SettingsEnforcer } from '@/components/layout/settings-enforcer';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SettingsEnforcer />
      <OnboardingWizard />
      <MockNotificationSimulator />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
      <CommandPalette />
      <GlobalDialogs />
      <Toaster position="top-right" />
    </div>
  );
}
