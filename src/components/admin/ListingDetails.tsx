
import React, { useState } from 'react';
import { Creator } from '@/types';
import { PendingSubmission } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, Edit, ExternalLink, Loader2, Star, Trash, X } from 'lucide-react';
import ListingEditor from './ListingEditor';

type ListingType = Creator | PendingSubmission;

interface ListingDetailsProps {
  listing: ListingType;
  isPending?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFeature?: (id: string) => void;
  onEdit?: (id: string) => void;
  onClose?: () => void;
}

export default function ListingDetails({
  listing,
  isPending = false,
  onApprove,
  onReject,
  onDelete,
  onFeature,
  onEdit,
  onClose
}: ListingDetailsProps) {
  const toast = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Helper to check if listing is a Creator
  const isCreator = (listing: ListingType): listing is Creator => {
    return 'profileImage' in listing;
  };

  // Get profile image
  const getProfileImage = () => {
    if (isCreator(listing)) {
      return listing.profileImage;
    }
    
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop';
  };
  
  // Get listing type badge
  const getListingTypeBadge = () => {
    if (isCreator(listing)) {
      if (listing.isFeatured) {
        return <Badge className="bg-findom-purple text-white">Featured</Badge>;
      } else if (listing.isNew) {
        return <Badge className="bg-findom-green text-white">New</Badge>;
      }
      return <Badge variant="outline">Active</Badge>;
    }
    
    return (
      <Badge variant={isPending ? "outline" : "default"}>
        {isPending ? "Pending" : "Unknown"}
      </Badge>
    );
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    if (onEdit) {
      onEdit(listing.id);
    }
    toast.toast({
      title: "Success",
      description: "Listing updated successfully",
    });
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      if (isCreator(listing)) {
        // Delete from creators table
        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', listing.id);
          
        if (error) throw error;
      } else {
        // Delete from listings table
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listing.id);
          
        if (error) throw error;
      }
      
      setIsDeleteDialogOpen(false);
      if (onDelete) {
        onDelete(listing.id);
      }
      
      toast.toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast.toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={getProfileImage()} 
                alt={listing.name} 
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop';
                }}
              />
              <AvatarFallback className="bg-findom-purple text-white text-xl">
                {listing.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{listing.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                @{listing.username} {getListingTypeBadge()}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isCreator(listing) && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onFeature?.(listing.id)}
                title={listing.isFeatured ? "Unfeature" : "Feature this listing"}
                className={listing.isFeatured ? "text-findom-purple" : ""}
              >
                <Star className="h-5 w-5" />
              </Button>
            )}
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Edit">
                  <Edit className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Edit Listing</DialogTitle>
                  <DialogDescription>
                    Make changes to the listing information
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <ListingEditor 
                    listingId={listing.id} 
                    onSuccess={handleEditSuccess}
                    onCancel={() => setIsEditDialogOpen(false)}
                    isAdmin={true}
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete">
                  <Trash className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    className="bg-red-500 hover:bg-red-600"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} title="Close">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            {isCreator(listing) && (
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            )}
            <TabsTrigger value="links">Social Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white/70">Category</h3>
                <p className="mt-1">
                  {isCreator(listing) 
                    ? listing.categories.join(', ') 
                    : (listing as PendingSubmission).category}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white/70">Bio</h3>
                <p className="mt-1">
                  {isCreator(listing) ? listing.bio : 'N/A'}
                </p>
              </div>
              
              {isPending && (
                <div>
                  <h3 className="text-sm font-medium text-white/70">Submitted At</h3>
                  <p className="mt-1">
                    {new Date((listing as PendingSubmission).submittedAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {isCreator(listing) && (
                <div>
                  <h3 className="text-sm font-medium text-white/70">Created At</h3>
                  <p className="mt-1">
                    {new Date(listing.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {isCreator(listing) && (
            <TabsContent value="gallery">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {listing.gallery && listing.gallery.length > 0 ? (
                  listing.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-white/60">
                    No gallery images available
                  </div>
                )}
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="links">
            <div className="space-y-3">
              {isCreator(listing) && (
                <>
                  {listing.socialLinks.twitter && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Twitter</span>
                      <a 
                        href={`https://twitter.com/${listing.socialLinks.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-findom-purple hover:underline"
                      >
                        {listing.socialLinks.twitter}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {listing.socialLinks.cashapp && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">CashApp</span>
                      <span className="text-findom-purple">{listing.socialLinks.cashapp}</span>
                    </div>
                  )}
                  
                  {listing.socialLinks.onlyfans && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">OnlyFans</span>
                      <a 
                        href={`https://onlyfans.com/${listing.socialLinks.onlyfans.replace('https://onlyfans.com/', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-findom-purple hover:underline"
                      >
                        {listing.socialLinks.onlyfans}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {listing.socialLinks.throne && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Amazon/Throne</span>
                      <a 
                        href={listing.socialLinks.throne}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-findom-purple hover:underline"
                      >
                        View Wishlist
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </>
              )}
              
              {(!isCreator(listing) || Object.values(listing.socialLinks).filter(Boolean).length === 0) && (
                <div className="text-center py-8 text-white/60">
                  No social links available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {isPending && onApprove && onReject && (
        <CardFooter className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => onReject(listing.id)}
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button 
            className="bg-findom-green hover:bg-findom-green/80"
            onClick={() => onApprove(listing.id)}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
