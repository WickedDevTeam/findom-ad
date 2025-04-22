
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TOSPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p>
              Welcome to our platform. By using our service, you agree to these terms.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">1. User Agreement</h2>
            <p>
              By accessing or using our service, you agree to be bound by these Terms of Service.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">2. Account Registration</h2>
            <p>
              You may need to create an account to use some features of our service. You are responsible for maintaining the confidentiality of your account information.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">3. User Content</h2>
            <p>
              You retain ownership of content you submit, but grant us a license to use, modify, and display it in connection with our service.
            </p>
            <p className="mt-4">
              This is a simplified version of our Terms of Service. The complete terms are available upon request.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOSPage;
