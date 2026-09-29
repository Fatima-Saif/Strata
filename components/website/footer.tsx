'use client';

import * as React from 'react';
import Link from 'next/link';
import { StrataLogo } from '@/components/ui/brand-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function WebsiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="inline-block">
              <StrataLogo />
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Unified command center for high-velocity software companies. Financial analytics, sprint tracking, team governance, and automated billing in one workspace.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Operational (99.99% SLA)</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-foreground transition-colors">
                  Revenue Analytics
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Sprint Kanban
                </Link>
              </li>
              <li>
                <Link href="/invoices" className="hover:text-foreground transition-colors">
                  Invoicing Engine
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-foreground transition-colors">
                  API & Webhooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Role-Based Access
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <Link href="/team" className="hover:text-foreground transition-colors">
                  Team Directory
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors">
                  Audit Logs
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-foreground transition-colors">
                  Executive Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-3">
              Workspace
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-foreground transition-colors">
                  Reset Password
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p>
              © {new Date().getFullYear()} Strata Systems, Inc. All rights reserved.
            </p>
            <span className="hidden sm:inline text-border">•</span>
            <p className="font-medium text-foreground/90">
              Powered by{' '}
              <a
                href="https://falconface.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground tracking-tight hover:underline hover:text-primary transition-colors"
              >
                FalconFace
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard" className="font-medium text-foreground hover:underline">
              Enter Workspace →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
