'use client';

import * as React from 'react';
import { useOnboarding } from '@/store/use-onboarding';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';

export function OnboardingWizard() {
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();
  const [step, setStep] = React.useState(1);
  const [company, setCompany] = React.useState('');
  const [teammate, setTeammate] = React.useState('');
  const [plan, setPlan] = React.useState('pro');
  
  // To avoid hydration mismatch, only render on client
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted || hasCompletedOnboarding) {
    return null;
  }

  const handleNext = () => {
    if (step === 1 && !company.trim()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-2xl border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
                <Button variant="ghost" size="sm" onClick={handleSkip} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                  Skip for now
                </Button>
              </div>
              <CardTitle className="text-2xl">
                {step === 1 && "Welcome! Let's get started."}
                {step === 2 && "Invite your team"}
                {step === 3 && "Choose a plan"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "What's the name of your organization?"}
                {step === 2 && "SaaS is better together. Add a teammate to get started."}
                {step === 3 && "Select the plan that best fits your needs."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      placeholder="Acme Inc." 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="teammate">Teammate Email (Optional)</Label>
                    <Input 
                      id="teammate" 
                      type="email"
                      placeholder="colleague@example.com" 
                      value={teammate}
                      onChange={(e) => setTeammate(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4 py-2">
                  <RadioGroup value={plan} onValueChange={setPlan} className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="starter" id="starter" />
                      <Label htmlFor="starter" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Starter</div>
                        <div className="text-sm text-muted-foreground">Perfect for small projects.</div>
                      </Label>
                      <div className="font-bold">$19/mo</div>
                    </div>
                    <div className="flex items-center space-x-2 border-primary border-2 p-4 rounded-lg bg-primary/5 cursor-pointer">
                      <RadioGroupItem value="pro" id="pro" />
                      <Label htmlFor="pro" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Pro <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Popular</span></div>
                        <div className="text-sm text-muted-foreground">For scaling teams.</div>
                      </Label>
                      <div className="font-bold">$49/mo</div>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border/50 pt-4">
              <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={step === 1 && !company.trim()}>
                {step === 3 ? "Complete Setup" : "Continue"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
