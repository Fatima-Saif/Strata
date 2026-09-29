'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useProjectsStore, Project, calculateProgress } from '@/lib/store/projects-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { PriorityBadge, StatusBadge } from './projects-table';
import { Checkbox } from '@/components/ui/checkbox';
import { FileIcon, FileText, FileImage, FileCode, Send, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProjectDetailDrawerProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDrawer({ project, open, onOpenChange }: ProjectDetailDrawerProps) {
  const toggleTaskCompletion = useProjectsStore(state => state.toggleTaskCompletion);
  const addComment = useProjectsStore(state => state.addComment);
  const [commentInput, setCommentInput] = React.useState('');
  
  if (!project) return null;

  const progress = calculateProgress(project.tasks);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(project.id, commentInput, { name: 'Current User', avatar: 'https://github.com/shadcn.png' });
    setCommentInput('');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'image': return <FileImage className="h-8 w-8 text-blue-500" />;
      case 'code': return <FileCode className="h-8 w-8 text-yellow-500" />;
      default: return <FileIcon className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl pr-8">{project.title}</SheetTitle>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                {format(new Date(project.dueDate), 'MMM d, yyyy')}
              </Badge>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </SheetHeader>

        <div className="py-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({project.tasks.length})</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Project Members</h4>
                <div className="flex flex-wrap gap-4">
                  {project.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {project.tasks.map(task => (
                <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                  <Checkbox 
                    id={task.id} 
                    checked={task.completed} 
                    onCheckedChange={() => toggleTaskCompletion(project.id, task.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <label 
                      htmlFor={task.id} 
                      className={`text-sm font-medium leading-none cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                    <div className="flex -space-x-1 pt-2">
                      {task.assignees.map((a, i) => (
                        <Avatar key={i} className="h-5 w-5 border border-background" title={a.name}>
                          <AvatarImage src={a.avatar} />
                          <AvatarFallback className="text-[8px]">{a.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/20">
                <p className="text-sm text-muted-foreground">Drag and drop files here to upload</p>
              </div>
              <div className="space-y-3">
                {project.files.map(file => (
                  <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
                    {getFileIcon(file.type)}
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                {project.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg rounded-tl-none leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t mt-auto">
                <form onSubmit={handleCommentSubmit} className="flex gap-2 relative">
                  <Input 
                    placeholder="Write a comment... use @ to mention" 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1"
                  />
                  {/* Basic mock dropdown for @mention would go here conditionally */}
                  <Button type="submit" size="icon" disabled={!commentInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
