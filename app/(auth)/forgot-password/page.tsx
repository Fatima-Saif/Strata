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
import { CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    
    // Simulate API call for password reset
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues('email')}</span>
          </CardDescription>
        </CardHeader>
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
          No worries, we'll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? "Sending reset link..." : "Reset password"}
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
