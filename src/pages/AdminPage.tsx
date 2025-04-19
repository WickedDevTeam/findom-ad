
import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  BarChart,
  Users,
  DollarSign,
  Eye
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { promotionPackages } from '@/data/promotions';
import { Creator } from '@/types';

// Admin dashboard statistics data
const statsData = [
  { name: 'Jan', listings: 4, visitors: 1000, revenue: 240 },
  { name: 'Feb', listings: 6, visitors: 1200, revenue: 320 },
  { name: 'Mar', listings: 8, visitors: 1500, revenue: 480 },
  { name: 'Apr', listings: 12, visitors: 2000, revenue: 520 },
  { name: 'May', listings: 16, visitors: 2400, revenue: 620 },
  { name: 'Jun', listings: 20, visitors: 3000, revenue: 820 },
];

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingSubmissions, setPendingSubmissions] = useState([
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
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredCreators = activeCreators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPending = pendingSubmissions.filter(submission => 
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-findom-purple" />
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeCreators.length}</div>
                <p className="text-xs text-white/70">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4 text-findom-green" />
                  Monthly Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3,246</div>
                <p className="text-xs text-white/70">+24% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-findom-orange" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$820</div>
                <p className="text-xs text-white/70">+32% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-findom-purple" />
                  Listings Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="listings" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-findom-orange" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <Chart data={statsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </Chart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
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
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=50&h=50&fit=crop';
                              }}
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
                          <Badge className="bg-findom-purple text-white">Featured</Badge>
                        ) : creator.isNew ? (
                          <Badge className="bg-findom-green text-white">New</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleFeature(creator.id)}
                            className={creator.isFeatured ? "text-findom-purple" : ""}
                          >
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotionPackages.map(promo => (
                <Card key={promo.id} className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{promo.title}</span>
                      <Badge className="bg-findom-purple">${promo.price}/{promo.duration}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70">{promo.description}</p>
                    <div className="flex justify-between items-center">
                      {promo.limited && (
                        <div className="text-sm text-white/70">
                          <span className="text-findom-orange font-bold">{promo.remaining}</span> spots remaining
                        </div>
                      )}
                      <Button variant="outline">Edit Package</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-6">
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
            </Card>
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
