'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function WebsitePricing() {
  const [annualBilling, setAnnualBilling] = React.useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'For early-stage startups and small engineering squads.',
      priceMonthly: 29,
      priceAnnual: 24,
      popular: false,
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline' as const,
      features: [
        'Up to 5 team members',
        'Real-time analytics dashboard',
        'Standard Kanban boards',
        'Basic RBAC permissions (2 roles)',
        'Up to 50 PDF invoices / month',
        'Community & Email support',
      ],
    },
    {
      name: 'Professional',
      description: 'For scaling companies requiring deep analytics and governance.',
      priceMonthly: 79,
      priceAnnual: 64,
      popular: true,
      buttonText: 'Get Started with Pro',
      buttonVariant: 'default' as const,
      features: [
        'Up to 25 team members',
        'Advanced time-series & cohort retention',
        'Linear-style Cmd+K Command palette',
        'Full RBAC matrix (Admin, Manager, Dev, Viewer)',
        'Unlimited automated PDF invoices',
        'Custom webhooks & API access',
        'Priority 24/7 Slack & Email support',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Dedicated infrastructure, custom SLAs, and compliance.',
      priceMonthly: 199,
      priceAnnual: 159,
      popular: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      features: [
        'Unlimited team members & seats',
        'Custom reporting engine & CSV export',
        'SOC-2 Type II audit logs & session monitoring',
        'Dedicated technical account architect',
        '99.99% Uptime SLA guarantee',
        'Custom SSO (SAML/Okta) integration',
        'Custom data retention policies',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono text-muted-foreground border-border mb-3">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Transparent, Predictable Plans
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Simple tiers designed to scale alongside your engineering and revenue growth.
          </p>

          {/* Billing Switcher */}
          <div className="mt-6 flex items-center gap-3">
            <span className={`text-xs font-medium ${!annualBilling ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                annualBilling ? 'bg-indigo-600' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${annualBilling ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
              <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20">
                20% off
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 transition-all duration-150 flex flex-col justify-between ${
                  plan.popular
                    ? 'bg-card border-2 border-indigo-600 shadow-md'
                    : 'bg-card border border-border hover:border-indigo-500/40 shadow-xs'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed min-h-[34px]">
                    {plan.description}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      / month {annualBilling ? '(billed annually)' : ''}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-border pt-5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Included capabilities
                    </div>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-border">
                  <Link href="/sign-up" className="w-full block">
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full h-10 text-xs font-semibold"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
