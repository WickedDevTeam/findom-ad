
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

interface ProfileAvatarUploadProps {
  avatarUrl: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({ avatarUrl, onAvatarChange }) => (
  <div>
    <Label htmlFor="avatar-upload" className="mb-2 block font-semibold text-white">
      Profile Avatar
    </Label>
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar" /> : <AvatarFallback>?</AvatarFallback>}
      </Avatar>
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={onAvatarChange}
        className="text-white"
      />
    </div>
  </div>
);

export default ProfileAvatarUpload;
