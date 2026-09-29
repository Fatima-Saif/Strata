'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectsTable } from '@/components/projects/projects-table';
import { ProjectsKanban } from '@/components/projects/projects-kanban';
import { ProjectDetailDrawer } from '@/components/projects/project-detail-drawer';
import { useProjectsStore, Project } from '@/lib/store/projects-store';
import { useNotifications } from '@/store/use-notifications';
import { LayoutList, Kanban, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isPast, isToday, differenceInHours } from 'date-fns';

import { useCommandStore } from '@/lib/store/command-store';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [search, setSearch] = React.useState('');
  const openDialog = useCommandStore((state) => state.openDialog);
  
  const projects = useProjectsStore(state => state.projects);
  const { addNotification } = useNotifications();

  // Evaluate deadlines for notifications
  React.useEffect(() => {
    projects.forEach(project => {
      if (project.status === 'Done') return;
      
      const due = new Date(project.dueDate);
      const hoursLeft = differenceInHours(due, new Date());
      
      // If overdue
      if (isPast(due) && !isToday(due)) {
        addNotification({
          title: 'Project Overdue',
          description: `The project "${project.title}" missed its deadline on ${due.toLocaleDateString()}.`,
          category: 'Updates',
        });
      } 
      // If due within 24 hours
      else if (hoursLeft > 0 && hoursLeft <= 24) {
        addNotification({
          title: 'Deadline Approaching',
          description: `"${project.title}" is due in less than 24 hours.`,
          category: 'Updates',
        });
      }
    });
  }, []); // Run only on mount to avoid spam

  return (
    <PageTransition>
      <PageHeader 
        title="Projects" 
        description="Track and manage all your ongoing software initiatives and sprints."
        action={
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-background" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => openDialog('createProject')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="mr-1.5 h-4 w-4" /> New Project
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="table" className="space-y-6 pb-10">
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <LayoutList className="h-4 w-4" /> Table View
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" /> Kanban Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <ProjectsTable onRowClick={setSelectedProject} search={search} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-0">
          <ProjectsKanban onRowClick={setSelectedProject} search={search} />
        </TabsContent>
      </Tabs>

      <ProjectDetailDrawer 
        project={selectedProject} 
        open={!!selectedProject} 
        onOpenChange={(v) => !v && setSelectedProject(null)} 
      />
    </PageTransition>
  );
}
