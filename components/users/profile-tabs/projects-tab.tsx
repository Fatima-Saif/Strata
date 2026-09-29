'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerProjects } from '@/lib/api/customer-details';
import { Loader2, FolderKanban, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ProjectsTab({ userId }: { userId: string }) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['customer-projects', userId],
    queryFn: () => fetchCustomerProjects(userId),
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-background">
        <FolderKanban className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">No active projects</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">This customer is not assigned to any projects.</p>
        <Button className="mt-6" variant="outline">Create Project</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20">Active</Badge>;
      case 'On Hold': return <Badge variant="secondary" className="text-muted-foreground">On Hold</Badge>;
      case 'Completed': return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/20">Completed</Badge>;
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Associated Projects</h3>
        <Button size="sm">
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-border rounded-lg bg-card p-5 hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
              </div>
              {getStatusBadge(project.status)}
            </div>
            
            <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{project.name}</h4>
            
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000" 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View details <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
