
import React, { useEffect } from 'react';
import ListingSubmissionForm from '@/components/forms/ListingSubmissionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const CreateListingPage = () => {
  const { user } = useAuth();

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
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
          <ListingSubmissionForm />
        </CardContent>
      </Card>

      <div className="text-center text-white/50 text-sm">
        <p>By submitting a listing, you agree to our terms of service and content guidelines.</p>
      </div>
    </div>
  );
};

export default CreateListingPage;
