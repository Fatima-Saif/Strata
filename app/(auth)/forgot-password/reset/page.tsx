'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam,
          token: tokenParam,
          newPassword: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      toast.success('Password updated successfully! You can now log in.');
      router.push(`/login?resetSuccess=true&email=${encodeURIComponent(emailParam)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader className="space-y-1 items-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Set new password</CardTitle>
        <CardDescription className="text-center">
          Enter a new secure password for <span className="font-semibold text-foreground">{emailParam || 'your account'}</span>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? "Updating password..." : "Set New Password"}
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

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading reset form...</div>}>
      <ResetPasswordFormContent />
    </React.Suspense>
  );
}
