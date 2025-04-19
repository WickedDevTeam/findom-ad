
import React from 'react';
import { PendingSubmission } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';

interface SubmissionsProps {
  submissions: PendingSubmission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  searchTerm: string;
}

const Submissions = ({ submissions, onApprove, onReject, searchTerm }: SubmissionsProps) => {
  const filteredSubmissions = submissions.filter(submission => 
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.username.toLowerCase().includes(searchTerm.toLowerCase())
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
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                <div className="flex flex-col items-center gap-2 text-white/60">
                  <AlertCircle className="h-5 w-5" />
                  <p>No pending submissions</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredSubmissions.map((submission, index) => (
              <TableRow key={submission.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.username}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-black/50">
                    {submission.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onApprove(submission.id)}
                      className="text-findom-green hover:text-findom-green/80 hover:bg-findom-green/10"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onReject(submission.id)}
                      className="text-findom-orange hover:text-findom-orange/80 hover:bg-findom-orange/10"
                    >
                      <X className="h-4 w-4" />
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

export default Submissions;
