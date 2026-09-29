'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiKeys, generateApiKey, deleteApiKey } from '@/lib/api/api-usage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Copy, Check, MoreHorizontal, Plus, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

export function ApiKeyManager() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [newKeyName, setNewKeyName] = React.useState('');
  
  // State for one-time reveal
  const [revealedKey, setRevealedKey] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState(false);

  const { data: keys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
  });

  const generateMutation = useMutation({
    mutationFn: generateApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setRevealedKey(data.secretReveal || null);
      setNewKeyName('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API Key revoked successfully');
      setDeleteConfirm(null);
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    generateMutation.mutate(newKeyName);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const closeReveal = () => {
    setRevealedKey(null);
    setAddOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys used to authenticate programmatic access.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Key
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            {keys?.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{key.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{key.maskedKey}</p>
                      <span className="text-xs text-muted-foreground">
                        • Created {format(new Date(key.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteConfirm(key.id)}
                    >
                      Revoke Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            
            {(!keys || keys.length === 0) && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No API keys found. Generate one to get started.
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Generate Key Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{revealedKey ? 'API Key Generated' : 'Generate New API Key'}</DialogTitle>
            <DialogDescription>
              {revealedKey 
                ? 'Please copy this key and store it somewhere safe. For security reasons, we cannot show it to you again.' 
                : 'Create a new key to access the API.'}
            </DialogDescription>
          </DialogHeader>
          
          {revealedKey ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 bg-muted p-3 rounded-md font-mono text-sm border border-border">
                <span className="flex-1 overflow-x-auto whitespace-nowrap">{revealedKey}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 shrink-0" 
                  onClick={() => handleCopy(revealedKey)}
                >
                  {copiedKey ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3 rounded-md text-xs font-medium flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>Make sure to copy your API key now. You won't be able to see it again!</div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button onClick={closeReveal} className="w-full">I have copied my key</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Key Name</Label>
                <Input 
                  placeholder="e.g. Zapier Integration" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={generateMutation.isPending}>
                  {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Key Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Revoke API Key
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this API key? Any applications currently using this key will immediately lose access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
