
import React, { useEffect } from 'react';
import ListingSubmissionForm from '@/components/forms/ListingSubmissionForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CreateListingPage = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Create Your Listing</h1>
        <p className="text-white/70 text-lg">
          Fill out the form below to submit your listing for review. We'll notify you once it's approved.
        </p>
      </div>
      
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
          <CardDescription>
            Please provide accurate information for your listing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[calc(100vh-16rem)]">
            <ListingSubmissionForm />
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="text-center text-white/50 text-sm">
        <p>By submitting a listing, you agree to our terms of service and content guidelines.</p>
      </div>
    </div>
  );
};

export default CreateListingPage;
