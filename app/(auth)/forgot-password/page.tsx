'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, MailCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [resetData, setResetData] = React.useState<{ email: string; resetUrl: string } | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to request password reset');
      }

      setResetData({
        email: data.email,
        resetUrl: result.resetUrl || `/forgot-password/reset?token=${result.token}&email=${encodeURIComponent(data.email)}`,
      });
      toast.success('Password reset link generated!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (resetData) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
            <MailCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Password Reset Link Dispatched</CardTitle>
          <CardDescription>
            A reset request was generated for <span className="font-semibold text-foreground">{resetData.email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click the direct link below to set your new password:
            </p>
            <Link href={resetData.resetUrl}>
              <Button className="w-full gap-2 font-medium" variant="default">
                <span>Reset Password Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-4 mt-2">
          <Link href="/login" className="text-sm text-primary font-medium hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Forgot password?</CardTitle>
        <CardDescription className="text-center">
          Enter your email and we'll generate a secure reset link for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? "Generating reset link..." : "Send Reset Instructions"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-4 mt-2">
        <Link href="/login" className="text-sm text-primary font-medium hover:underline">
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
