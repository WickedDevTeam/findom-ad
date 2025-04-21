
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creators } from '@/data/creators';
import { Search, ShieldAlert, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
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

// Admin dashboard statistics data
const statsData: StatsData[] = [
  { name: 'Jan', listings: 4, visitors: 1000, revenue: 240 },
  { name: 'Feb', listings: 6, visitors: 1200, revenue: 320 },
  { name: 'Mar', listings: 8, visitors: 1500, revenue: 480 },
  { name: 'Apr', listings: 12, visitors: 2000, revenue: 520 },
  { name: 'May', listings: 16, visitors: 2400, revenue: 620 },
  { name: 'Jun', listings: 20, visitors: 3000, revenue: 820 },
];

const AdminPage = () => {
  const { requireAuth, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [activeCreators, setActiveCreators] = useState<Creator[]>(creators);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  
  useEffect(() => {
    // First check authentication
    const isAuthenticated = requireAuth();
    
    // If authenticated, check if user is admin
    if (isAuthenticated && user) {
      checkAdminStatus();
    } else {
      setIsLoading(false);
      setAdminCheckComplete(true);
    }
  }, [requireAuth, user]);
  
  // Fetch pending submissions
  useEffect(() => {
    if (user && isAdmin) {
      fetchPendingSubmissions();
    }
  }, [user, isAdmin]);
  
  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast.error('Failed to verify admin status');
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin || false);
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
      setAdminCheckComplete(true);
    }
  };
  
  const fetchPendingSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'pending');
        
      if (error) throw error;
      
      if (data) {
        const submissions: PendingSubmission[] = data.map(item => ({
          id: item.id,
          name: item.name,
          username: item.username,
          category: item.category,
          type: item.type || 'Free',
          submittedAt: item.submitted_at,
          email: item.email,
          bio: item.bio || '',
          twitter: item.twitter || '',
          cashapp: item.cashapp || '',
          onlyfans: item.onlyfans || '',
          throne: item.throne || '',
        }));
        
        setPendingSubmissions(submissions);
      }
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
    }
  };
  
  const handleApprove = (id: string) => {
    setPendingSubmissions(prev => prev.filter(item => item.id !== id));
    toast.success('Submission approved!', {
      description: `The submission has been approved and published.`
    });
  };
  
  const handleReject = (id: string) => {
    setPendingSubmissions(prev => prev.filter(item => item.id !== id));
    toast.error('Submission rejected', {
      description: 'The submission has been rejected.'
    });
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
    toast.success(`Listing ${isNew ? 'created' : 'updated'} successfully`);
    // Would refresh the creators list here in a real implementation
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show access denied if not admin
  if (adminCheckComplete && !isAdmin) {
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
          <Dashboard statsData={statsData} activeCreatorsCount={activeCreators.length} />
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
