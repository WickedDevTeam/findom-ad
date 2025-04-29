
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creators } from '@/data/creators';
import { Search, ShieldAlert, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Creator } from '@/types';
import { PendingSubmission, StatsData } from '@/types/admin';
import Dashboard from '@/components/admin/Dashboard';
import Listings from '@/components/admin/Listings';
import Submissions from '@/components/admin/Submissions';
import NotionSync from '@/components/admin/NotionSync';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ListingEditor from '@/components/admin/ListingEditor';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const AdminPage = () => {
  const { requireAuth, user } = useAuth();
  const { toast: toastNotify } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCreators, setActiveCreators] = useState<Creator[]>(creators);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  
  // Admin status check
  const { data: isAdmin = false, isLoading: isAdminLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      try {
        // Using the is_admin function from Supabase
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          toastNotify({
            title: 'Error',
            description: 'Failed to verify admin status',
            variant: 'destructive'
          });
          return false;
        }
        
        return data || false;
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        return false;
      }
    },
    enabled: !!user,
  });
  
  // Fetch statistics data
  const { data: statsData = [], isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // In a production app, you would fetch actual stats from a database table
      // For now, we'll use sample data with proper typing
      return [
        { name: 'Jan', listings: 4, visitors: 1000, revenue: 240 },
        { name: 'Feb', listings: 6, visitors: 1200, revenue: 320 },
        { name: 'Mar', listings: 8, visitors: 1500, revenue: 480 },
        { name: 'Apr', listings: 12, visitors: 2000, revenue: 520 },
        { name: 'May', listings: 16, visitors: 2400, revenue: 620 },
        { name: 'Jun', listings: 20, visitors: 3000, revenue: 820 },
      ] as StatsData[];
    },
    enabled: isAdmin,
  });
  
  // Fetch active creators count
  const { data: activeCreatorsCount = 0, isLoading: creatorCountLoading } = useQuery({
    queryKey: ['activeCreatorsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('creators')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);
        
      if (error) {
        toastNotify({
          title: 'Error',
          description: 'Failed to fetch active creators count',
          variant: 'destructive'
        });
        return 0;
      }
      
      return count || 0;
    },
    enabled: isAdmin,
  });
  
  // Fetch pending submissions
  const { data: pendingSubmissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useQuery({
    queryKey: ['pendingSubmissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });
        
      if (error) {
        toastNotify({
          title: 'Error',
          description: 'Failed to fetch pending submissions',
          variant: 'destructive'
        });
        return [];
      }
      
      // Transform the data
      const submissions: PendingSubmission[] = data.map(item => ({
        id: item.id,
        name: item.name,
        username: item.username || '',
        category: item.category,
        type: item.type || 'standard',
        submittedAt: item.submitted_at,
        email: item.email,
        bio: item.bio || '',
        twitter: item.twitter || '',
        cashapp: item.cashapp || '',
        onlyfans: item.onlyfans || '',
        throne: item.throne || '',
      }));
      
      return submissions;
    },
    enabled: isAdmin,
  });
  
  // Initial authentication check
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);
  
  const handleApprove = async (id: string) => {
    try {
      // Mark the submission as approved
      const { error } = await supabase
        .from('listings')
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      refetchSubmissions();
      
      toastNotify({
        title: 'Success',
        description: 'Submission approved and published',
      });
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toastNotify({
        title: 'Error',
        description: 'Failed to approve submission: ' + error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      refetchSubmissions();
      
      toastNotify({
        title: 'Rejected',
        description: 'Submission has been rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toastNotify({
        title: 'Error',
        description: 'Failed to reject submission: ' + error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleDelete = (id: string) => {
    setActiveCreators(prev => prev.filter(creator => creator.id !== id));
    toast.success('Listing deleted', {
      description: 'The listing has been permanently removed.'
    });
  };
  
  const handleFeature = (id: string) => {
    setActiveCreators(prev => 
      prev.map(creator => 
        creator.id === id 
          ? { ...creator, isFeatured: !creator.isFeatured } 
          : creator
      )
    );
    
    const creator = activeCreators.find(c => c.id === id);
    const action = creator?.isFeatured ? 'unfeatured' : 'featured';
    
    toast.success(`Listing ${action}`, {
      description: `The listing is now ${action} ${action === 'featured' ? 'on the homepage' : ''}.`
    });
  };
  
  const handleNewCreator = (id: string, isNew: boolean) => {
    setIsCreatorDialogOpen(false);
    toastNotify({
      title: 'Success',
      description: `Listing ${isNew ? 'created' : 'updated'} successfully`,
    });
    // Would refresh the creators list here in a real implementation
  };
  
  if (isAdminLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin area. Please contact an administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70">Manage listings, submissions, and site content</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Dialog open={isCreatorDialogOpen} onOpenChange={setIsCreatorDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-findom-purple hover:bg-findom-purple/80">
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Listing</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <ListingEditor 
                  onSuccess={handleNewCreator}
                  onCancel={() => setIsCreatorDialogOpen(false)}
                  isAdmin={true}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="submissions">
            Pending Submissions
            <Badge className="ml-2 bg-findom-orange">{pendingSubmissions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="notion-sync">Notion Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Dashboard 
            statsData={statsData} 
            activeCreatorsCount={activeCreatorsCount}
            isLoading={statsLoading || creatorCountLoading} 
          />
        </TabsContent>
        
        <TabsContent value="listings">
          <Listings 
            creators={activeCreators}
            onDelete={handleDelete}
            onFeature={handleFeature}
            searchTerm={searchTerm}
          />
        </TabsContent>
        
        <TabsContent value="submissions">
          <Submissions 
            submissions={pendingSubmissions}
            onApprove={handleApprove}
            onReject={handleReject}
            searchTerm={searchTerm}
            isLoading={submissionsLoading}
          />
        </TabsContent>

        <TabsContent value="notion-sync">
          <NotionSync />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
