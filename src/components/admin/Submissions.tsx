
// Update the Submissions component to include the isLoading prop
import React, { useState } from 'react';
import { PendingSubmission } from '@/types/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface SubmissionsProps {
  submissions: PendingSubmission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  searchTerm?: string;
  isLoading?: boolean; // Add isLoading prop
}

const Submissions = ({ submissions, onApprove, onReject, searchTerm = '', isLoading = false }: SubmissionsProps) => {
  const [processing, setProcessing] = useState<Record<string, 'approving' | 'rejecting' | null>>({});
  
  // Filter the submissions based on the search term
  const filteredSubmissions = submissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.username.toLowerCase().includes(searchLower) ||
      submission.category.toLowerCase().includes(searchLower) ||
      submission.type.toLowerCase().includes(searchLower)
    );
  });
  
  const handleApprove = async (id: string) => {
    setProcessing(prev => ({ ...prev, [id]: 'approving' }));
    try {
      await onApprove(id);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: null }));
    }
  };
  
  const handleReject = async (id: string) => {
    setProcessing(prev => ({ ...prev, [id]: 'rejecting' }));
    try {
      await onReject(id);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: null }));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        <span className="ml-2 text-white/70">Loading submissions...</span>
      </div>
    );
  }
  
  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center my-12 text-white/70">
        {searchTerm ? 'No submissions match your search.' : 'No pending submissions at this time.'}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredSubmissions.map((submission) => (
        <Card key={submission.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-black/30 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar className="h-12 w-12 border-2 border-findom-purple">
              <AvatarImage 
                src={submission.profile_image} 
                alt={submission.name} 
                className="object-cover"
              />
              <AvatarFallback className="bg-findom-purple text-white">
                {submission.name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-white">{submission.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-white/70">@{submission.username}</span>
                <Badge variant="outline" className="text-xs font-normal">
                  {submission.category}
                </Badge>
                <Badge variant={submission.type === 'premium' ? 'default' : 'secondary'} className="text-xs font-normal">
                  {submission.type === 'premium' ? 'Premium' : 'Standard'}
                </Badge>
                <span className="text-xs text-white/50">
                  {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 hover:border-white/40"
              asChild
            >
              <a 
                href={`/creator/${submission.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </a>
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              className="border-red-600/30 hover:border-red-600/70 hover:bg-red-900/20 text-red-500"
              disabled={!!processing[submission.id]}
              onClick={() => handleReject(submission.id)}
            >
              {processing[submission.id] === 'rejecting' ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5 mr-1" />
              )}
              Reject
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={!!processing[submission.id]}
              onClick={() => handleApprove(submission.id)}
            >
              {processing[submission.id] === 'approving' ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 mr-1" />
              )}
              Approve
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Submissions;
