'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const emailParam = searchParams.get('email');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [isLoading, setIsLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(
    registered ? 'Account successfully created! Please enter your password to sign in.' : null
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailParam || '',
      password: '',
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    if (emailParam) {
      form.setValue('email', emailParam);
    }
  }, [emailParam, form]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setSuccessMsg(null);
    
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      form.setError('root', { 
        message: 'Invalid credentials. Please verify your email and password.' 
      });
      setIsLoading(false);
    } else {
      // Record real-time security event in SQLite
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'User Authenticated',
          description: `${data.email} successfully logged into Strata.`,
          category: 'Security',
        }),
      }).catch(() => {});

      toast.success('Signed in successfully!');
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function handleDemoLogin() {
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: 'admin@acme.com',
      password: 'password123',
    });
    if (!result?.error) {
      toast.success('Signed in with Demo Admin credentials');
      router.push('/dashboard');
      router.refresh();
    } else {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome to Strata</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your operations dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMsg && (
          <div className="p-3 text-xs font-medium text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember this workstation</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <span>{form.formState.errors.root.message}</span>
              </div>
            )}

            <Button className="w-full font-medium" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Quick Access</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-xs font-medium" 
              onClick={handleDemoLogin} 
              disabled={isLoading}
            >
              Sign in as Demo Admin (admin@acme.com)
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-4 mt-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="w-full max-w-md p-8 text-center text-sm text-muted-foreground">
        Loading sign in...
      </div>
    }>
      <LoginFormContent />
    </React.Suspense>
  );
}
