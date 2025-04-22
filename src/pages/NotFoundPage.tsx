
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white/80 mb-6">Page Not Found</h2>
      <p className="text-white/60 max-w-md mb-8">
        The page you are looking for does not exist or has been moved to another URL.
      </p>
      <Button asChild className="bg-findom-purple hover:bg-findom-purple/80">
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
