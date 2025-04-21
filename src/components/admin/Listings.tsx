import React, { useState, useEffect } from 'react';
import { Creator, SocialLinks } from '@/types';
import { Json } from '@/integrations/supabase/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Edit, Trash, AlertCircle, Plus, Search, Filter, SlidersHorizontal, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import ListingDetails from './ListingDetails';
import ListingEditor from './ListingEditor';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ListingsProps {
  creators: Creator[];
  onDelete: (id: string) => void;
  onFeature: (id: string) => void;
  searchTerm: string;
}

const Listings = ({ creators: initialCreators, onDelete, onFeature, searchTerm }: ListingsProps) => {
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewListingOpen, setIsNewListingOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<string>('createdAt');

  useEffect(() => {
    setCreators(initialCreators);
  }, [initialCreators]);

  useEffect(() => {
    let results = [...creators];
    
    if (localSearchTerm) {
      results = results.filter(creator => 
        creator.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        creator.username.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      results = results.filter(creator => 
        creator.categories.some(category => 
          category.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }
    
    if (statusFilter !== 'all') {
      if (statusFilter === 'featured') {
        results = results.filter(creator => creator.isFeatured);
      } else if (statusFilter === 'new') {
        results = results.filter(creator => creator.isNew);
      } else if (statusFilter === 'active') {
        results = results.filter(creator => !creator.isFeatured && !creator.isNew);
      }
    }
    
    results.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'username') {
        return sortOrder === 'asc'
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      }
      return 0;
    });
    
    setFilteredCreators(results);
  }, [creators, localSearchTerm, categoryFilter, statusFilter, sortField, sortOrder]);

  const getAllCategories = () => {
    const categories = new Set<string>();
    creators.forEach(creator => {
      creator.categories.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories);
  };

  const handleCreatorClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsDetailsOpen(true);
  };

  const handleDeleteCreator = (id: string) => {
    onDelete(id);
    setCreators(prevCreators => prevCreators.filter(creator => creator.id !== id));
    setIsDetailsOpen(false);
  };

  const handleFeatureCreator = (id: string) => {
    onFeature(id);
    setCreators(prevCreators => 
      prevCreators.map(creator => 
        creator.id === id 
          ? { ...creator, isFeatured: !creator.isFeatured } 
          : creator
      )
    );
  };

  const handleAddNewListing = (id: string, isNew: boolean) => {
    setIsNewListingOpen(false);
    toast.success(`Listing ${isNew ? 'created' : 'updated'} successfully`);
    
    fetchCreators();
  };

  const fetchCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        const formattedCreators: Creator[] = data.map(item => {
          let socialLinks: SocialLinks = {
            twitter: undefined,
            throne: undefined,
            cashapp: undefined,
            onlyfans: undefined,
            other: undefined
          };
          
          if (typeof item.social_links === 'string') {
            try {
              const parsedLinks = JSON.parse(item.social_links);
              socialLinks = {
                twitter: parsedLinks.twitter || undefined,
                throne: parsedLinks.throne || undefined,
                cashapp: parsedLinks.cashapp || undefined,
                onlyfans: parsedLinks.onlyfans || undefined,
                other: parsedLinks.other || undefined
              };
            } catch (e) {
              console.error('Error parsing social_links JSON:', e);
            }
          } else if (item.social_links && typeof item.social_links === 'object') {
            const links = item.social_links as Record<string, any>;
            socialLinks = {
              twitter: links.twitter || undefined,
              throne: links.throne || undefined,
              cashapp: links.cashapp || undefined,
              onlyfans: links.onlyfans || undefined,
              other: links.other || undefined
            };
          }
          
          return {
            id: item.id,
            name: item.name,
            username: item.username,
            profileImage: item.profile_image,
            coverImage: item.cover_image || '',
            bio: item.bio,
            socialLinks: socialLinks,
            isVerified: item.is_verified,
            isFeatured: item.is_featured,
            isNew: item.is_new,
            type: item.type,
            categories: [],
            gallery: [],
            createdAt: item.created_at,
          };
        });
        
        for (const creator of formattedCreators) {
          const { data: categoryLinks } = await supabase
            .from('creator_categories')
            .select('category_id')
            .eq('creator_id', creator.id);
            
          if (categoryLinks && categoryLinks.length > 0) {
            const categoryIds = categoryLinks.map(link => link.category_id);
            
            const { data: categories } = await supabase
              .from('categories')
              .select('name')
              .in('id', categoryIds);
              
            if (categories) {
              creator.categories = categories.map(c => c.name);
            }
          }
          
          const { data: galleryImages } = await supabase
            .from('creator_galleries')
            .select('image_url')
            .eq('creator_id', creator.id);
            
          if (galleryImages) {
            creator.gallery = galleryImages.map(img => img.image_url);
          }
        }
        
        setCreators(formattedCreators);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error('Failed to fetch listings');
    }
  };

  const handleExportData = () => {
    try {
      const headers = ['Name', 'Username', 'Categories', 'Status', 'Created At'];
      const csvData = filteredCreators.map(creator => [
        creator.name,
        creator.username,
        creator.categories.join('; '),
        creator.isFeatured ? 'Featured' : creator.isNew ? 'New' : 'Active',
        new Date(creator.createdAt).toLocaleString()
      ]);
      
      csvData.unshift(headers);
      
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `listings-export-${new Date().toISOString().slice(0, 10)}.csv`);
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
                placeholder="Search listings..."
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
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setSortField('createdAt');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '(Oldest)' : '(Newest)')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSortField('name');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    Name {sortField === 'name' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setSortField('username');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    Username {sortField === 'username' && (sortOrder === 'asc' ? '(A-Z)' : '(Z-A)')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Dialog open={isNewListingOpen} onOpenChange={setIsNewListingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-findom-purple hover:bg-findom-purple/80">
                    <Plus className="h-4 w-4 mr-2" />
                    New Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Listing</DialogTitle>
                    <DialogDescription>
                      Add a new creator listing directly to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <ListingEditor 
                      onSuccess={handleAddNewListing}
                      onCancel={() => setIsNewListingOpen(false)}
                      isAdmin={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
                    <TableRow 
                      key={creator.id}
                      className="cursor-pointer hover:bg-white/5"
                      onClick={() => handleCreatorClick(creator)}
                    >
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
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeatureCreator(creator.id);
                            }}
                            className={creator.isFeatured ? "text-findom-purple" : ""}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCreator(creator);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCreator(creator.id);
                            }}
                          >
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
        </CardContent>
      </Card>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedCreator && (
            <ListingDetails
              listing={selectedCreator}
              onDelete={handleDeleteCreator}
              onFeature={handleFeatureCreator}
              onEdit={() => {
                setIsDetailsOpen(false);
                fetchCreators();
              }}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Listings;
