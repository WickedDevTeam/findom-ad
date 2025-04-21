
import React, { useState, useEffect, useCallback } from 'react';
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
import { Loader2, RefreshCw, Database, ExternalLink, Clock, CheckCircle, AlertTriangle, Eye, EyeOff, Info } from 'lucide-react';
import { 
  getSyncConfig, 
  updateSyncConfig, 
  initiateSync, 
  testNotionConnection,
  getSyncHistory,
  isSyncDue,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NotionSync = () => {
  const { requireAuth } = useAuth();
  const [config, setConfig] = useState<NotionSyncConfig>(defaultSyncConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [autoSyncChecked, setAutoSyncChecked] = useState(false);
  const [nextSyncDate, setNextSyncDate] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');

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
      setAutoSyncChecked(config.autoSync);
      
      // Calculate next sync date
      if (config.enabled && config.autoSync && config.lastSyncedAt) {
        const lastSyncDate = new Date(config.lastSyncedAt);
        const next = new Date(lastSyncDate.getTime() + (config.syncInterval * 60 * 1000));
        setNextSyncDate(next);
      } else {
        setNextSyncDate(null);
      }
    }
  }, [config, form]);

  // Auto sync check effect
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (config.enabled && config.autoSync) {
      // Check every minute if sync is due
      intervalId = window.setInterval(async () => {
        try {
          const syncDue = await isSyncDue();
          if (syncDue) {
            handleSyncNow(true);
          }
        } catch (error) {
          console.error("Error checking if sync is due:", error);
        }
      }, 60000); // Check every minute
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [config.enabled, config.autoSync, config.lastSyncedAt, config.syncInterval]);

  const loadSyncConfig = async () => {
    setIsLoading(true);
    try {
      const configData = await getSyncConfig();
      setConfig(configData);
      
      // If API key and database ID are set, test the connection
      if (configData.notionApiKey && configData.notionDatabaseId) {
        const result = await testNotionConnection(configData);
        setConnectionStatus(result.success ? 'connected' : 'failed');
      }
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
      
      setConnectionStatus(result.success ? 'connected' : 'failed');
      
      if (result.success) {
        toast.success(result.message, {
          description: result.databaseTitle ? `Database: ${result.databaseTitle}` : undefined
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Connection test error:", error);
      setConnectionStatus('failed');
      toast.error("Failed to test connection to Notion");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncNow = async (isAutoSync = false) => {
    if (isSyncing) return; // Prevent multiple syncs at once
    
    setIsSyncing(true);
    try {
      const result = await initiateSync();
      
      if (result.success) {
        toast.success(
          isAutoSync ? "Auto-sync completed" : result.message,
          { description: result.stats ? `Added: ${result.stats.added}, Updated: ${result.stats.updated}` : undefined }
        );
        
        // Update config with new lastSyncedAt
        setConfig((prev) => ({
          ...prev,
          lastSyncedAt: new Date().toISOString()
        }));
        
        // Calculate next sync date
        if (config.autoSync) {
          const next = new Date(Date.now() + (config.syncInterval * 60 * 1000));
          setNextSyncDate(next);
        }
        
        // Refresh sync history after a short delay
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
      // Check if autoSync was enabled and API key + database ID are provided
      if (data.autoSync && (!data.notionApiKey || !data.notionDatabaseId)) {
        toast.error("Cannot enable auto-sync without API key and database ID");
        return;
      }
      
      const success = await updateSyncConfig(data);
      if (success) {
        toast.success("Notion sync configuration saved successfully");
        setConfig(data);
        
        // If the key or database ID changed, update the connection status
        if (data.notionApiKey !== config.notionApiKey || data.notionDatabaseId !== config.notionDatabaseId) {
          setConnectionStatus('unknown');
          
          // Test connection if both are provided
          if (data.notionApiKey && data.notionDatabaseId) {
            handleTestConnection();
          }
        }
      } else {
        toast.error("Failed to save Notion sync configuration");
      }
    } catch (error) {
      console.error("Save config error:", error);
      toast.error("An error occurred while saving the configuration");
    }
  };

  const getTimeFromNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return "Overdue";
    
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec} seconds`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
    
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-findom-purple" />
      </div>
    );
  }

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <FormLabel className="flex items-center gap-1">
                        Notion API Key
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-white/50 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Create an integration in the Notion developer portal and connect it to your database
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showApiKey ? "text" : "password"}
                            placeholder="Enter your Notion API secret token" 
                            {...field} 
                            className={connectionStatus === 'failed' ? "border-red-500" : ""}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      <FormLabel className="flex items-center gap-1">
                        Notion Database ID
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-white/50 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Found in the URL of your Notion database, after the domain and before the query parameters
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your Notion database ID" 
                          {...field} 
                          className={connectionStatus === 'failed' ? "border-red-500" : ""}
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
                        value={field.value.toString()}
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
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setAutoSyncChecked(checked);
                          }}
                          disabled={!form.getValues().notionApiKey || !form.getValues().notionDatabaseId}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
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
            </Form>
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
                  {nextSyncDate && config.autoSync && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Next Sync:</span>
                      <span className="text-white">
                        {nextSyncDate.toLocaleString()} ({getTimeFromNow(nextSyncDate.toISOString())})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/70">Connection Status:</span>
                    <Badge 
                      variant={connectionStatus === 'unknown' ? "outline" : "default"} 
                      className={
                        connectionStatus === 'connected' ? "bg-findom-green" : 
                        connectionStatus === 'failed' ? "bg-findom-orange" : ""
                      }
                    >
                      {connectionStatus === 'connected' ? "Connected" : 
                       connectionStatus === 'failed' ? "Failed" : "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  onClick={() => handleSyncNow()}
                  disabled={!config.enabled || isSyncing || !config.notionApiKey || !config.notionDatabaseId}
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
                
                {config.notionDatabaseId && (
                  <a 
                    href={`https://notion.so/${config.notionDatabaseId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" /> Open Notion
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      {new Date(sync.created_at || sync.started_at).toLocaleString()}
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
