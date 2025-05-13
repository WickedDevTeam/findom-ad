
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Check, AlertTriangle, Settings, Database } from 'lucide-react';
import { NotionSyncConfig, getSyncConfig, updateSyncConfig, testNotionConnection } from '@/utils/notionSync';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NotionConfigPage = () => {
  const { requireAuth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testInProgress, setTestInProgress] = useState(false);
  const [config, setConfig] = useState<NotionSyncConfig | null>(null);
  
  // Fetch the current Notion sync configuration
  const { data: syncConfig, isLoading, error } = useQuery({
    queryKey: ['notionSyncConfig'],
    queryFn: getSyncConfig,
  });
  
  // Update config when fetched
  useEffect(() => {
    if (syncConfig) {
      setConfig(syncConfig);
    }
  }, [syncConfig]);
  
  // Mutation to update the configuration
  const updateConfigMutation = useMutation({
    mutationFn: updateSyncConfig,
    onSuccess: () => {
      toast({
        title: 'Configuration Saved',
        description: 'Your Notion sync configuration has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['notionSyncConfig'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Save',
        description: `An error occurred: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Check auth on load
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      updateConfigMutation.mutate(config);
    }
  };
  
  // Handle connection test
  const handleTestConnection = async () => {
    if (!config) return;
    
    setTestInProgress(true);
    
    try {
      const result = await testNotionConnection(config);
      
      if (result.success) {
        toast({
          title: 'Connection Successful',
          description: `Connected to Notion database: ${result.databaseTitle || config.notionDatabaseId}`,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Test Failed',
        description: `Error testing connection: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setTestInProgress(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };
  
  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [name]: checked
      };
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load Notion configuration</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!config) return null;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center gap-2">
          <Database className="h-8 w-8" />
          Notion CMS Configuration
        </h1>
        <p className="text-white/70 text-lg">
          Connect your Notion database to use it as your content management system.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Settings
            </CardTitle>
            <CardDescription>
              Enter your Notion API key and database ID to connect to your Notion workspace
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notionApiKey">Notion API Key</Label>
              <Input
                id="notionApiKey"
                name="notionApiKey"
                type="password"
                value={config.notionApiKey}
                onChange={handleInputChange}
                placeholder="secret_abcdef123456..."
                className="bg-black/50"
              />
              <p className="text-xs text-white/50">
                You can get an API key from the <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener" className="underline">Notion Integrations</a> page.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notionDatabaseId">Notion Database ID</Label>
              <Input
                id="notionDatabaseId"
                name="notionDatabaseId"
                value={config.notionDatabaseId}
                onChange={handleInputChange}
                placeholder="1f1805bf509680bd8868c0ef4c405494"
                className="bg-black/50"
              />
              <p className="text-xs text-white/50">
                The ID is in the URL of your Notion database: https://www.notion.so/workspace/[DATABASE_ID]
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="databaseUrl">Database URL</Label>
              <Input
                id="databaseUrl"
                name="databaseUrl"
                value={config.databaseUrl}
                onChange={handleInputChange}
                placeholder="https://www.notion.so/workspace/1f1805bf..."
                className="bg-black/50"
              />
              <p className="text-xs text-white/50">
                The full URL to your Notion database.
              </p>
            </div>
            
            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={!config.notionApiKey || !config.notionDatabaseId || testInProgress}
                className="flex items-center gap-2"
              >
                {testInProgress ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing connection...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle>Sync Configuration</CardTitle>
            <CardDescription>
              Configure how your Notion database syncs with the website
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Notion Sync</h4>
                <p className="text-sm text-white/70">
                  Turn on synchronization between Notion and this website
                </p>
              </div>
              <Switch
                id="enabled"
                name="enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => handleSwitchChange('enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Use Notion as Primary CMS</h4>
                <p className="text-sm text-white/70">
                  Use Notion as the primary content management system for listings
                </p>
              </div>
              <Switch
                id="notionAsMainCms"
                name="notionAsMainCms"
                checked={config.notionAsMainCms}
                onCheckedChange={(checked) => handleSwitchChange('notionAsMainCms', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Auto Sync</h4>
                <p className="text-sm text-white/70">
                  Automatically sync content on a regular schedule
                </p>
              </div>
              <Switch
                id="autoSync"
                name="autoSync"
                checked={config.autoSync}
                onCheckedChange={(checked) => handleSwitchChange('autoSync', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
              <Input
                id="syncInterval"
                name="syncInterval"
                type="number"
                min="5"
                max="1440"
                value={config.syncInterval}
                onChange={handleInputChange}
                className="bg-black/50"
                disabled={!config.autoSync}
              />
              <p className="text-xs text-white/50">
                How often to automatically sync data (minimum 5 minutes)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="listingStatusField">Status Field Name</Label>
              <Input
                id="listingStatusField"
                name="listingStatusField"
                value={config.listingStatusField}
                onChange={handleInputChange}
                placeholder="Status"
                className="bg-black/50"
              />
              <p className="text-xs text-white/50">
                The name of the field in your Notion database that tracks listing status
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="listingTypeField">Type Field Name</Label>
              <Input
                id="listingTypeField"
                name="listingTypeField"
                value={config.listingTypeField}
                onChange={handleInputChange}
                placeholder="Type"
                className="bg-black/50"
              />
              <p className="text-xs text-white/50">
                The name of the field in your Notion database that tracks listing type
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-findom-purple hover:bg-findom-purple/80"
            disabled={updateConfigMutation.isPending}
          >
            {updateConfigMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotionConfigPage;
