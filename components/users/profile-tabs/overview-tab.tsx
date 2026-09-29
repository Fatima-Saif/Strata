'use client';

import * as React from 'react';
import { User, updateUser } from '@/lib/api/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Save, X, Edit2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is too short').max(20, 'Phone number is too long'),
  address: z.string().min(5, 'Address is too short'),
  country: z.string().min(2, 'Country code must be 2 characters').max(2, 'Country code must be 2 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function OverviewTab({ user }: { user: User }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user.email,
      phone: user.phone,
      address: user.address,
      country: user.country,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormValues) => updateUser(user.id, data),
    onMutate: async (newValues) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      
      queryClient.setQueryData<User[]>(['users'], (old) => {
        if (!old) return [];
        return old.map(u => u.id === user.id ? { ...u, ...newValues } : u);
      });
      
      return { previousUsers };
    },
    onError: (err, newValues, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      toast.error('Failed to update contact info');
    },
    onSuccess: () => {
      toast.success('Contact info updated');
      setIsEditing(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    reset({
      email: user.email,
      phone: user.phone,
      address: user.address,
      country: user.country,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lifetime Value</CardDescription>
            <CardTitle className="text-2xl">${user.ltv.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tenure</CardDescription>
            <CardTitle className="text-2xl">
              {Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 3600 * 24 * 30))} months
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">{user.plan}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Contact Details Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Main contact details and address for this account</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input id="email" {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                ) : (
                  <p className="font-medium text-sm">{user.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input id="phone" {...register('phone')} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                ) : (
                  <p className="font-medium text-sm">{user.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Billing Address
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input id="address" {...register('address')} />
                    {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                  </div>
                ) : (
                  <p className="font-medium text-sm">{user.address}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" /> Country Code
                </Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input id="country" {...register('country')} placeholder="US" maxLength={2} className="uppercase" />
                    {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">
                      {/* Convert ISO code to Emoji Flag */}
                      {user.country.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))}
                    </span>
                    <p className="font-medium text-sm uppercase">{user.country}</p>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end gap-2 pt-4 mt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
