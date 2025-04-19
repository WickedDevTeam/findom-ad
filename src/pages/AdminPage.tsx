
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creators } from '@/data/creators';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Search, 
  Edit, 
  Trash, 
  Star, 
  AlertCircle 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const pendingSubmissions = [
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
  ];
  
  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPending = pendingSubmissions.filter(submission => 
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleApprove = (id: string) => {
    toast.success('Submission approved!', {
      description: `The submission has been approved and published.`
    });
  };
  
  const handleReject = (id: string) => {
    toast.error('Submission rejected', {
      description: 'The submission has been rejected.'
    });
  };
  
  const handleDelete = (id: string) => {
    toast.success('Listing deleted', {
      description: 'The listing has been permanently removed.'
    });
  };
  
  const handleFeature = (id: string) => {
    toast.success('Listing featured', {
      description: 'The listing is now featured on the homepage.'
    });
  };
  
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
      
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="submissions">
            Pending Submissions
            <Badge className="ml-2 bg-findom-orange">{pendingSubmissions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="space-y-6">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <AlertCircle className="h-5 w-5" />
                        <p>No listings found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCreators.map((creator, index) => (
                    <TableRow key={creator.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={creator.profileImage} 
                              alt={creator.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{creator.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{creator.username}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {creator.categories.map(category => (
                            <Badge key={category} variant="outline" className="bg-black/50">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {creator.isFeatured ? (
                          <Badge className="badge-featured">Featured</Badge>
                        ) : creator.isNew ? (
                          <Badge className="badge-new">New</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleFeature(creator.id)}>
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(creator.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="submissions" className="space-y-6">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPending.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <AlertCircle className="h-5 w-5" />
                        <p>No pending submissions</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPending.map((submission, index) => (
                    <TableRow key={submission.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>{submission.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-black/50">
                          {submission.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleApprove(submission.id)}
                            className="text-findom-green hover:text-findom-green/80 hover:bg-findom-green/10"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleReject(submission.id)}
                            className="text-findom-orange hover:text-findom-orange/80 hover:bg-findom-orange/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="promotions">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Promotion Settings</h3>
            <p className="text-white/70 mb-6">
              Manage promotional packages, featured listings, and sponsorship opportunities.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Sponsor Price ($)</label>
                  <Input type="number" defaultValue="49.99" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Listing Price ($)</label>
                  <Input type="number" defaultValue="29.99" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Site Settings</h3>
            <p className="text-white/70 mb-6">
              Manage global site settings, categories, and other configuration options.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input defaultValue="Findom.ad" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Description</label>
                <Input defaultValue="The ultimate Findom directory" />
              </div>
              
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
