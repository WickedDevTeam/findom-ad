
import React, { useState, useEffect } from 'react';
import { PendingSubmission } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Clock, Eye, Filter, Search, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import ListingDetails from './ListingDetails';
import ListingEditor from './ListingEditor';

interface SubmissionsProps {
  submissions: PendingSubmission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  searchTerm: string;
}

export default function Submissions({ submissions: initialSubmissions, onApprove, onReject, searchTerm }: SubmissionsProps) {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>(initialSubmissions);
  const [filteredSubmissions, setFilteredSubmissions] = useState<PendingSubmission[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Update submissions when props change
  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...submissions];
    
    // Apply search filter
    if (localSearchTerm) {
      results = results.filter(submission => 
        submission.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        submission.username.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(submission => 
        submission.category === categoryFilter
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(submission => 
        submission.type === typeFilter
      );
    }
    
    // Sort by submission date, newest first
    results.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    setFilteredSubmissions(results);
  }, [submissions, localSearchTerm, categoryFilter, typeFilter]);

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'pending');
        
      if (error) throw error;
      
      if (data) {
        const formattedSubmissions: PendingSubmission[] = data.map(item => ({
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
        
        setSubmissions(formattedSubmissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch pending submissions');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique categories from submissions
  const getAllCategories = () => {
    const categories = new Set<string>();
    submissions.forEach(submission => {
      categories.add(submission.category);
    });
    return Array.from(categories);
  };

  // Get all unique types from submissions
  const getAllTypes = () => {
    const types = new Set<string>();
    submissions.forEach(submission => {
      types.add(submission.type);
    });
    return Array.from(types);
  };

  const handleSubmissionClick = (submission: PendingSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };

  const handleApproveSubmission = async (id: string) => {
    try {
      // Get the submission details
      const submission = submissions.find(s => s.id === id);
      if (!submission) return;
      
      // 1. Create a new entry in the creators table
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', submission.category)
        .maybeSingle();
        
      if (!categoryData) {
        throw new Error(`Category "${submission.category}" not found`);
      }
      
      const socialLinks = {
        twitter: submission.twitter || null,
        cashapp: submission.cashapp || null,
        onlyfans: submission.onlyfans || null,
        throne: submission.throne || null,
      };
      
      // Create the creator
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .insert({
          name: submission.name,
          username: submission.username,
          bio: submission.bio || '',
          profile_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop', // Default image
          type: submission.type === 'Premium' ? 'premium' : 'standard',
          social_links: socialLinks,
          is_verified: true,
          is_new: true,
        })
        .select()
        .single();
        
      if (creatorError) throw creatorError;
      
      // 2. Add the category relationship
      if (creatorData) {
        const { error: categoryError } = await supabase
          .from('creator_categories')
          .insert({
            creator_id: creatorData.id,
            category_id: categoryData.id,
          });
          
        if (categoryError) throw categoryError;
      }
      
      // 3. Send notification to the user if they're registered
      const { data: userData } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (userData && userData.user_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userData.user_id,
            title: 'Listing Approved',
            message: `Your listing "${submission.name}" has been approved and is now live!`,
            type: 'success',
            link: `/creator/${submission.username}`,
          });
      }
      
      // 4. Update the listing status to 'approved'
      const { error: updateError } = await supabase
        .from('listings')
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Call the parent callback
      onApprove(id);
      
      // Update local state
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setIsDetailsOpen(false);
      
      toast.success('Listing approved and published successfully');
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toast.error(error.message || 'Failed to approve submission');
    }
  };

  const handleRejectSubmission = async (id: string) => {
    try {
      // Get the user ID associated with the listing
      const { data: userData } = await supabase
        .from('listings')
        .select('user_id, name')
        .eq('id', id)
        .single();
        
      // Send notification to the user if they're registered
      if (userData && userData.user_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userData.user_id,
            title: 'Listing Rejected',
            message: `Your listing "${userData.name}" was not approved. Please review our guidelines and try again.`,
            type: 'error',
          });
      }
      
      // Update the listing status to 'rejected'
      const { error: updateError } = await supabase
        .from('listings')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Call the parent callback
      onReject(id);
      
      // Update local state
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setIsDetailsOpen(false);
      
      toast.success('Listing rejected');
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toast.error(error.message || 'Failed to reject submission');
    }
  };

  const handleUpdateSubmission = (id: string) => {
    setIsEditOpen(false);
    fetchPendingSubmissions();
    toast.success('Submission updated successfully');
  };

  const handleExportData = () => {
    try {
      // Convert the data to CSV
      const headers = ['Name', 'Username', 'Category', 'Type', 'Submitted At'];
      const csvData = filteredSubmissions.map(submission => [
        submission.name,
        submission.username,
        submission.category,
        submission.type,
        new Date(submission.submittedAt).toLocaleString()
      ]);
      
      // Add headers
      csvData.unshift(headers);
      
      // Convert to CSV string
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      // Create a Blob and download link
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `submissions-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[300px]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getAllCategories().map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getAllTypes().map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <AlertCircle className="h-5 w-5" />
                        <p>No pending submissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission, index) => (
                    <TableRow 
                      key={submission.id}
                      className="cursor-pointer hover:bg-white/5"
                      onClick={() => handleSubmissionClick(submission)}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>{submission.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-black/50">
                          {submission.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.type === 'Premium' ? 'default' : 'outline'} className={submission.type === 'Premium' ? 'bg-findom-purple' : ''}>
                          {submission.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-white/60" />
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmissionClick(submission);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-600/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectSubmission(submission.id);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-findom-green hover:text-findom-green hover:bg-findom-green/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveSubmission(submission.id);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Submission details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedSubmission && (
            <ListingDetails
              listing={selectedSubmission}
              isPending={true}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              onEdit={() => {
                setIsDetailsOpen(false);
                setSelectedSubmission(selectedSubmission);
                setIsEditOpen(true);
              }}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit submission dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl">
          {selectedSubmission && (
            <ListingEditor
              listingId={selectedSubmission.id}
              onSuccess={handleUpdateSubmission}
              onCancel={() => setIsEditOpen(false)}
              isAdmin={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
