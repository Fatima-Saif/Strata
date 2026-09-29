'use client';

import * as React from 'react';
import { useProjectsStore, Project, calculateProgress, ProjectPriority } from '@/lib/store/projects-store';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isPast, isToday } from 'date-fns';
import { MessageSquare, Paperclip, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PriorityBadge = ({ priority }: { priority: ProjectPriority }) => {
  const colors = {
    Low: 'bg-muted text-muted-foreground',
    Medium: 'bg-blue-500/10 text-blue-600',
    High: 'bg-amber-500/10 text-amber-600',
    Urgent: 'bg-destructive/10 text-destructive',
  };
  return <Badge variant="secondary" className={`shadow-none ${colors[priority]}`}>{priority}</Badge>;
};

export const StatusBadge = ({ status }: { status: string }) => {
  return <Badge variant="outline" className="font-medium">{status}</Badge>;
};

interface ProjectsTableProps {
  onRowClick: (project: Project) => void;
  search: string;
}

export function ProjectsTable({ onRowClick, search }: ProjectsTableProps) {
  const projects = useProjectsStore(state => state.projects);

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase()) ||
    p.priority.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(project => {
              const progress = calculateProgress(project.tasks);
              const dueDate = new Date(project.dueDate);
              const isOverdue = isPast(dueDate) && !isToday(dueDate) && project.status !== 'Done';

              return (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(project)}
                >
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={project.priority} />
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {format(dueDate, 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2 w-[60px]" />
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((m, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback>{m.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><CheckSquare className="h-3 w-3"/> {project.tasks.length}</div>
                      <div className="flex items-center gap-1"><Paperclip className="h-3 w-3"/> {project.files.length}</div>
                      <div className="flex items-center gap-1"><MessageSquare className="h-3 w-3"/> {project.comments.length}</div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight">No projects found</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      {search ? `No projects match "${search}". Try adjusting your filters.` : 'Get started by creating your first project.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
