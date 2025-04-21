
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creators } from '@/data/creators';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Creator } from '@/types';
import { PendingSubmission, StatsData } from '@/types/admin';
import Dashboard from '@/components/admin/Dashboard';
import Listings from '@/components/admin/Listings';
import Submissions from '@/components/admin/Submissions';
import NotionSync from '@/components/admin/NotionSync';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

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
  const { requireAuth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([
    { 
      id: 'p1', 
      name: 'Emma Watson', 
      username: 'emma-watson', 
      category: 'Celebrities', 
      type: 'Premium', 
      submittedAt: '2024-04-15T10:30:00Z'
    },
    { 
      id: 'p2', 
      name: 'Ryan Reynolds', 
      username: 'ryan-reynolds', 
      category: 'Celebrities', 
      type: 'Free', 
      submittedAt: '2024-04-14T08:15:00Z'
    },
    { 
      id: 'p3', 
      name: 'Jessica Smith', 
      username: 'jessica-findom', 
      category: 'Findoms', 
      type: 'Premium', 
      submittedAt: '2024-04-16T12:30:00Z'
    },
  ]);
  
  const [activeCreators, setActiveCreators] = useState<Creator[]>(creators);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // First check authentication
    const isAuthenticated = requireAuth();
    
    // If authenticated, continue loading the admin page
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [requireAuth]);
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
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
        
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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
