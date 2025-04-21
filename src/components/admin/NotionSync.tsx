import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Database, ExternalLink, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { 
  getSyncConfig, 
  updateSyncConfig, 
  initiateSync, 
  testNotionConnection,
  getSyncHistory,
  NotionSyncConfig,
  SyncStats,
  defaultSyncConfig
} from '@/utils/notionSync';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const NotionSync = () => {
  const { requireAuth } = useAuth();
  const [config, setConfig] = useState<NotionSyncConfig>(defaultSyncConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);

  const form = useForm<NotionSyncConfig>({
    defaultValues: defaultSyncConfig
  });

  useEffect(() => {
    requireAuth();
    loadSyncConfig();
    loadSyncHistory();
  }, []);

  useEffect(() => {
    if (config) {
      form.reset(config);
    }
  }, [config, form]);

  const loadSyncConfig = async () => {
    setIsLoading(true);
    try {
      const configData = await getSyncConfig();
      setConfig(configData);
    } catch (error) {
      console.error("Error loading sync config:", error);
      toast.error("Failed to load Notion sync configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSyncHistory = async () => {
    try {
      const history = await getSyncHistory();
      setSyncHistory(history);
    } catch (error) {
      console.error("Error loading sync history:", error);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const formValues = form.getValues();
      const result = await testNotionConnection(formValues);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Connection test error:", error);
      toast.error("Failed to test connection to Notion");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await initiateSync();
      
      if (result.success) {
        toast.success(result.message);
        // Update last synced time in the UI immediately
        setConfig((prev) => ({
          ...prev,
          lastSyncedAt: new Date().toISOString()
        }));
        // Reload sync history after a short delay to allow the backend to update
        setTimeout(loadSyncHistory, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to initiate sync with Notion");
    } finally {
      setIsSyncing(false);
    }
  };

  const onSubmit = async (data: NotionSyncConfig) => {
    try {
      const success = await updateSyncConfig(data);
      if (success) {
        toast.success("Notion sync configuration saved successfully");
        setConfig(data);
      } else {
        toast.error("Failed to save Notion sync configuration");
      }
    } catch (error) {
      console.error("Save config error:", error);
      toast.error("An error occurred while saving the configuration");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-findom-purple" />
      </div>
    );
  }

  // --- FORMS PATCH: use react-hook-form FormProvider properly ---
  // instead of <Form ... onSubmit={form.handleSubmit}> place <FormProvider> + explicitly add <form ... onSubmit=...>
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notion Sync</h2>
        <p className="text-white/70">
          Synchronize your website listings with a Notion database
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-findom-purple" /> Configuration
            </CardTitle>
            <CardDescription>
              Set up your Notion integration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Notion Sync</FormLabel>
                          <FormDescription>
                            Turn the Notion sync feature on or off
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notionApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notion API Key</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showApiKey ? "text" : "password"}
                              placeholder="Enter your Notion API secret token" 
                              {...field} 
                            />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? "Hide" : "Show"}
                          </Button>
                        </div>
                        <FormDescription>
                          Create an integration in Notion and paste the secret token here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notionDatabaseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notion Database ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your Notion database ID" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The ID of your Notion database (found in the URL)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="syncInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sync Interval</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sync frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">Every 15 minutes</SelectItem>
                            <SelectItem value="30">Every 30 minutes</SelectItem>
                            <SelectItem value="60">Every hour</SelectItem>
                            <SelectItem value="360">Every 6 hours</SelectItem>
                            <SelectItem value="720">Every 12 hours</SelectItem>
                            <SelectItem value="1440">Every day</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormDescription>
                        How often should the automatic sync run
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="autoSync"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Sync</FormLabel>
                        <FormDescription>
                          Automatically sync based on the interval
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-findom-purple hover:bg-findom-purple/80"
                >
                  Save Configuration
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={isTesting || !form.getValues().notionApiKey || !form.getValues().notionDatabaseId}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-findom-purple" /> Sync Status
            </CardTitle>
            <CardDescription>
              Monitor and manage synchronization with Notion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 p-4">
                <h3 className="font-medium mb-3 text-white">Current Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Sync Enabled:</span>
                    <Badge variant={config.enabled ? "default" : "outline"} className={config.enabled ? "bg-findom-green" : ""}>
                      {config.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Auto Sync:</span>
                    <Badge variant={config.autoSync ? "default" : "outline"} className={config.autoSync ? "bg-findom-purple" : ""}>
                      {config.autoSync ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Sync Interval:</span>
                    <span className="text-white">{config.syncInterval} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Last Synced:</span>
                    <span className="text-white">
                      {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleString() : "Never"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  onClick={handleSyncNow}
                  disabled={!config.enabled || isSyncing}
                  className="bg-findom-purple hover:bg-findom-purple/80"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
                    </>
                  )}
                </Button>
                
                <a 
                  href={`https://notion.so/${config.notionDatabaseId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" disabled={!config.notionDatabaseId}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Notion
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync History */}
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-findom-purple" /> Sync History
          </CardTitle>
          <CardDescription>
            Recent synchronization activity with Notion
          </CardDescription>
        </CardHeader>
        <CardContent>
          {syncHistory.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No sync history available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {syncHistory.map((sync, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {sync.success ? (
                        <CheckCircle className="h-5 w-5 text-findom-green" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-findom-orange" />
                      )}
                      <h4 className="font-medium text-white">
                        {sync.success ? "Successful Sync" : "Failed Sync"}
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(sync.created_at).toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="text-white/70 text-sm">Added: <span className="text-white">{sync.stats?.added || 0}</span></div>
                    <div className="text-white/70 text-sm">Updated: <span className="text-white">{sync.stats?.updated || 0}</span></div>
                    <div className="text-white/70 text-sm">Deleted: <span className="text-white">{sync.stats?.deleted || 0}</span></div>
                    <div className="text-white/70 text-sm">Failed: <span className="text-white">{sync.stats?.failed || 0}</span></div>
                  </div>
                  
                  {sync.message && (
                    <p className="text-sm text-white/70 mt-2">{sync.message}</p>
                  )}
                  
                  {sync.stats?.errors && sync.stats.errors.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto text-findom-orange">
                          View {sync.stats.errors.length} errors
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sync Errors</AlertDialogTitle>
                          <AlertDialogDescription>
                            The following errors occurred during synchronization:
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="max-h-[300px] overflow-y-auto my-4">
                          <ul className="space-y-2">
                            {sync.stats.errors.map((error: string, i: number) => (
                              <li key={i} className="text-sm text-white/70 bg-black/20 p-2 rounded">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogAction className="bg-findom-purple hover:bg-findom-purple/80">
                            Close
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotionSync;
