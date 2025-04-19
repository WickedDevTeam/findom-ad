
import React from 'react';
import { Creator } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Edit, Trash, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ListingsProps {
  creators: Creator[];
  onDelete: (id: string) => void;
  onFeature: (id: string) => void;
  searchTerm: string;
}

const Listings = ({ creators, onDelete, onFeature, searchTerm }: ListingsProps) => {
  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                      onClick={() => onFeature(creator.id)}
                      className={creator.isFeatured ? "text-findom-purple" : ""}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(creator.id)}>
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
  );
};

export default Listings;
