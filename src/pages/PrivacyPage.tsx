
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p>
              This Privacy Policy describes how we collect, use, and share your personal information.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, submit content, or communicate with us.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your information to provide, maintain, and improve our services, communicate with you, and personalize your experience.
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy.
            </p>
            <p className="mt-4">
              This is a simplified version of our Privacy Policy. The complete policy is available upon request.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;
