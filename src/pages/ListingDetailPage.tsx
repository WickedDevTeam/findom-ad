
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const ListingDetailPage = () => {
  const { listingId } = useParams();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">Listing Details</h1>
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10 p-4 sm:p-6">
        <p className="text-white/70 mb-4">
          Viewing listing ID: {listingId}
        </p>
        <p className="text-white/70">
          This page is under construction. Detailed listing information will be available soon.
        </p>
      </Card>
    </div>
  );
};

export default ListingDetailPage;
