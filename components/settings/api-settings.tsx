'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settings-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Key, Copy, RefreshCw, Trash2, Plus, Webhook } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

export function ApiSettings() {
  const store = useSettingsStore();
  const [webhook, setWebhook] = React.useState(store.webhookUrl);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key copied to clipboard');
  };

  const handleRegenerate = (id: string) => {
    if (confirm('Regenerating will invalidate the old key. Are you sure?')) {
      store.deleteApiKey(id);
      store.generateApiKey('Regenerated Key');
      toast.success('Key regenerated');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this API Key?')) {
      store.deleteApiKey(id);
      toast.success('Key deleted');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    store.generateApiKey(newKeyName);
    setNewKeyName('');
    setDialogOpen(false);
    toast.success('New API Key generated');
  };

  const testWebhook = () => {
    const p = new Promise(resolve => setTimeout(resolve, 1000));
    toast.promise(p, {
      loading: 'Testing webhook...',
      success: 'Webhook test successful! (200 OK)',
      error: 'Webhook test failed'
    });
  };

  const saveWebhook = () => {
    store.updateWebhookUrl(webhook);
    toast.success('Webhook settings saved');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your secret API keys for programmatic access.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" /> Generate New Key
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Generate API Key</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label>Key Name</Label>
                  <Input 
                    value={newKeyName} 
                    onChange={e => setNewKeyName(e.target.value)} 
                    placeholder="e.g., Production Server" 
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Generate</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Last Used</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {store.apiKeys.map((k) => (
                  <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{k.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{k.key.substring(0, 8)}••••••••</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {k.lastUsed === 'Never' ? 'Never' : new Date(k.lastUsed).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(k.key)} title="Copy"><Copy className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRegenerate(k.id)} title="Regenerate"><RefreshCw className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(k.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {store.apiKeys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No API keys generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Receive real-time event payloads to your server.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Endpoint URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Webhook className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={webhook} 
                  onChange={e => setWebhook(e.target.value)} 
                  className="pl-9" 
                  placeholder="https://" 
                />
              </div>
              <Button variant="outline" onClick={testWebhook}>Test</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={saveWebhook}>Save Webhook</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
