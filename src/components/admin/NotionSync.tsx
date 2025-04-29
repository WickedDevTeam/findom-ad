
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { SyncHistoryItem } from '@/types/admin';

const NotionSync = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Fetch sync history using React Query
  const { data: syncHistory = [], isLoading, error, refetch } = useQuery({
    queryKey: ['syncHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sync_history')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Properly cast the data to match SyncHistoryItem interface
      return (data || []).map(item => ({
        id: item.id,
        started_at: item.started_at,
        completed_at: item.completed_at,
        success: item.success,
        status: item.status,
        message: item.message,
        sync_type: item.sync_type || 'notion',
        stats: item.stats ? {
          added: item.stats.added || 0,
          updated: item.stats.updated || 0,
          deleted: item.stats.deleted || 0,
          failed: item.stats.failed || 0,
          errors: item.stats.errors || []
        } : null
      })) as SyncHistoryItem[];
    }
  });
  
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      // Create a new sync_history entry to track this sync
      const { data: syncRecord, error: createError } = await supabase
        .from('sync_history')
        .insert({
          status: 'running',
          sync_type: 'notion'
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      // In a real implementation, you would call your Edge Function to start the sync
      // const { error } = await supabase.functions.invoke('notion-sync', {
      //   body: { syncId: syncRecord.id }
      // });
      // 
      // if (error) throw error;
      
      // For demonstration, we'll simulate a successful sync after a delay
      setTimeout(async () => {
        try {
          // Update the sync record to show completion
          await supabase
            .from('sync_history')
            .update({
              completed_at: new Date().toISOString(),
              status: 'completed',
              success: true,
              stats: {
                added: 5,
                updated: 2,
                deleted: 0,
                failed: 0,
                errors: []
              }
            })
            .eq('id', syncRecord.id);
            
          toast({
            title: "Sync Complete",
            description: "Successfully synchronized 7 items with Notion",
          });
          
          // Refetch sync history to show updated results
          refetch();
        } catch (updateError) {
          console.error('Error updating sync record:', updateError);
        } finally {
          setIsSyncing(false);
        }
      }, 3000);
      
    } catch (syncError) {
      console.error('Error starting sync:', syncError);
      toast({
        title: "Sync Failed",
        description: "There was an error starting the sync process",
        variant: "destructive"
      });
      setIsSyncing(false);
    }
  };
  
  const getStatusBadge = (status: string, success: boolean | null) => {
    if (status === 'running' || status === 'pending') {
      return <Badge className="bg-amber-500 text-black">In Progress</Badge>;
    } else if (status === 'completed') {
      if (success) {
        return <Badge className="bg-green-500 text-black">Success</Badge>;
      } else {
        return <Badge className="bg-red-500">Failed</Badge>;
      }
    } else {
      return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Notion Sync</CardTitle>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="bg-findom-purple hover:bg-findom-purple/80"
          >
            {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/70 mb-6">
            Synchronize creators and listings data with your Notion database. This process may take a few minutes to complete.
          </p>
          
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Started</TableHead>
                  <TableHead className="text-white/70">Completed</TableHead>
                  <TableHead className="text-white/70">Added</TableHead>
                  <TableHead className="text-white/70">Updated</TableHead>
                  <TableHead className="text-white/70">Failed</TableHead>
                  <TableHead className="text-white/70 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/50" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center text-red-400">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>Failed to load sync history</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : syncHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-white/50">
                      No sync history found. Run your first sync to see results here.
                    </TableCell>
                  </TableRow>
                ) : (
                  syncHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-white/5">
                      <TableCell>
                        {getStatusBadge(item.status, item.success)}
                      </TableCell>
                      <TableCell>{formatDate(item.started_at)}</TableCell>
                      <TableCell>{formatDate(item.completed_at)}</TableCell>
                      <TableCell>{item.stats?.added || 0}</TableCell>
                      <TableCell>{item.stats?.updated || 0}</TableCell>
                      <TableCell>
                        {item.stats?.failed ? (
                          <span className="text-red-400">{item.stats.failed}</span>
                        ) : (
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.stats?.errors && item.stats.errors.length > 0 ? (
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 px-2">
                            <XCircle className="h-4 w-4 mr-1" />
                            View Errors
                          </Button>
                        ) : item.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500 inline-block" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotionSync;
