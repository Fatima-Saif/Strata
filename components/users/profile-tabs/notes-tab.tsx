'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCustomerNotes, addCustomerNote } from '@/lib/api/customer-details';
import { Loader2, Send, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export function NotesTab({ userId }: { userId: string }) {
  const [newNote, setNewNote] = React.useState('');
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['customer-notes', userId],
    queryFn: () => fetchCustomerNotes(userId),
  });

  const mutation = useMutation({
    mutationFn: (content: string) => addCustomerNote(userId, content),
    onSuccess: () => {
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['customer-notes', userId] });
      toast.success('Note added successfully');
    },
    onError: () => {
      toast.error('Failed to add note');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    mutation.mutate(newNote);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm shrink-0">
        <form onSubmit={handleSubmit}>
          <Textarea 
            placeholder="Add an internal note about this customer..." 
            className="resize-none border-0 focus-visible:ring-0 p-0 shadow-none min-h-[80px]"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Notes are visible only to internal team members.</span>
            <Button size="sm" type="submit" disabled={!newNote.trim() || mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Save Note
            </Button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : !notes || notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-background">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg">No notes yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Be the first to add an internal note for this customer.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="flex gap-4 p-4 border-b border-border last:border-0 bg-transparent">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={note.authorAvatar} alt={note.authorName} />
                <AvatarFallback>{note.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-foreground">{note.authorName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
