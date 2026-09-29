'use client';

import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useProjectsStore, Project, ProjectStatus, calculateProgress } from '@/lib/store/projects-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isPast, isToday } from 'date-fns';
import { PriorityBadge } from './projects-table';
import { Progress } from '@/components/ui/progress';
import { GripVertical, MessageSquare, Paperclip, CheckSquare } from 'lucide-react';

const COLUMNS: ProjectStatus[] = ['Backlog', 'In Progress', 'In Review', 'Done'];

interface ProjectsKanbanProps {
  onRowClick: (project: Project) => void;
  search: string;
}

export function ProjectsKanban({ onRowClick, search }: ProjectsKanbanProps) {
  const projects = useProjectsStore(state => state.projects);
  const updateProjectStatus = useProjectsStore(state => state.updateProjectStatus);

  // Filter projects based on search
  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase()) ||
    p.priority.toLowerCase().includes(search.toLowerCase())
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Update status in global store
    const newStatus = destination.droppableId as ProjectStatus;
    updateProjectStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full items-start">
        {COLUMNS.map((columnId) => {
          const columnProjects = filtered.filter(p => p.status === columnId);
          return (
            <div key={columnId} className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl min-h-[500px]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{columnId}</h3>
                <Badge variant="secondary">{columnProjects.length}</Badge>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-3 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-muted/50' : ''}`}
                  >
                    {columnProjects.map((project, index) => {
                      const progress = calculateProgress(project.tasks);
                      const dueDate = new Date(project.dueDate);
                      const isOverdue = isPast(dueDate) && !isToday(dueDate) && project.status !== 'Done';

                      return (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <Card 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`cursor-pointer group hover:border-primary/50 transition-colors ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 z-50' : ''}`}
                              onClick={() => onRowClick(project)}
                            >
                              <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <div {...provided.dragHandleProps} className="text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <PriorityBadge priority={project.priority} />
                                  </div>
                                  <span className={`text-xs ${isOverdue ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                    {format(dueDate, 'MMM d')}
                                  </span>
                                </div>

                                <div className="font-semibold text-sm leading-tight">{project.title}</div>
                                
                                <div>
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-1.5" />
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex -space-x-2">
                                    {project.members.slice(0, 3).map((m, i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={m.avatar} />
                                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1"><CheckSquare className="h-3 w-3"/>{project.tasks.length}</div>
                                    <div className="flex items-center gap-1"><MessageSquare className="h-3 w-3"/>{project.comments.length}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
