
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Listing {
  id: string;
  title: string;
  description: string;
  price?: number;
  created_at: string;
  user_id: string;
  category?: string;
  image_url?: string;
}

const ListingDetailPage = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // For now, we'll just simulate a listing since the backend might not be set up yet
        // In a real implementation, you would fetch from your database
        
        // Uncommenting this once your database is ready:
        /*
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', listingId)
          .single();
        
        if (error) throw error;
        setListing(data);
        */
        
        // Simulated data for now
        setTimeout(() => {
          setListing({
            id: listingId || '1',
            title: 'Example Listing',
            description: 'This is a placeholder for a real listing that will be fetched from the database.',
            price: 100,
            created_at: new Date().toISOString(),
            user_id: '1',
            category: 'Findoms',
            image_url: 'https://via.placeholder.com/400x300'
          });
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details');
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    } else {
      setError('Listing ID is missing');
      setLoading(false);
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-4 sm:p-6">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-10 w-32" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Error</h1>
        <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-4 sm:p-6">
          <p className="text-white/70 mb-4">{error}</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
        {listing?.title || 'Listing Details'}
      </h1>
      
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-4 sm:p-6">
        {listing?.image_url && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img 
              src={listing.image_url} 
              alt={listing.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{listing?.title}</h2>
            <p className="text-white/50 text-sm">
              ID: {listing?.id} • Category: {listing?.category || 'Uncategorized'}
            </p>
          </div>
          
          {listing?.price && (
            <div className="mt-2 sm:mt-0 bg-black/40 px-4 py-2 rounded-lg">
              <span className="text-findom-green text-xl font-bold">${listing.price}</span>
            </div>
          )}
        </div>
        
        <p className="text-white/70 mb-6 whitespace-pre-line">
          {listing?.description || 'No description available.'}
        </p>
        
        <div className="flex gap-3">
          <Button variant="default">Contact Seller</Button>
          <Button variant="outline">Add to Favorites</Button>
        </div>
      </Card>
    </div>
  );
};

export default ListingDetailPage;
