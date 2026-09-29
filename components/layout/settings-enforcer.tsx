'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';

export function SettingsEnforcer() {
  const { accentColor, compactMode } = useSettingsStore();

  React.useEffect(() => {
    const root = document.documentElement;
    // Set accent color
    root.style.setProperty('--primary', accentColor);

    // Toggle compact mode class
    if (compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }, [accentColor, compactMode]);

  return null;
}
