'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TeamSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team & Roles</CardTitle>
          <CardDescription>Manage your workspace members and their access levels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 border rounded-lg items-center text-center space-y-2 bg-muted/20">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="font-medium">12 Active Members</h4>
              <p className="text-xs text-muted-foreground">Across 3 departments</p>
            </div>
            
            <div className="flex flex-col p-4 border rounded-lg items-center text-center space-y-2 bg-muted/20">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-medium">4 Roles Defined</h4>
              <p className="text-xs text-muted-foreground">Admin, Manager, Dev, Viewer</p>
            </div>

            <div className="flex flex-col p-4 border rounded-lg items-center text-center space-y-2 bg-muted/20">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <UserPlus className="h-6 w-6" />
              </div>
              <h4 className="font-medium">2 Pending Invites</h4>
              <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg border flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Advanced Team Management</h4>
              <p className="text-xs text-muted-foreground mt-1">To invite new members, assign roles, or manage departments, please visit the full Team Management dashboard.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end gap-4">
          <Link href="/users">
            <Button>
              Go to Team Management <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
