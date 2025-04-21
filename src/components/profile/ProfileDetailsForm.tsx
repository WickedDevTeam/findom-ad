
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileDetailsFormProps {
  displayName: string;
  setDisplayName: (value: string) => void;
  username: string;
  email: string;
  bio: string;
  setBio: (value: string) => void;
  loading: boolean;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  displayName,
  setDisplayName,
  username,
  email,
  bio,
  setBio,
  loading
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Display Name */}
      <div>
        <Label htmlFor="display-name" className="block font-semibold text-white mb-1">
          Display Name
        </Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          disabled={loading}
        />
      </div>

      {/* Username (non-editable) */}
      <div>
        <Label htmlFor="username" className="block font-semibold text-white mb-1">
          Username
        </Label>
        <Input id="username" value={username} disabled placeholder="Your username" />
      </div>
    </div>

    {/* Bio */}
    <div>
      <Label htmlFor="bio" className="block font-semibold text-white mb-1">
        Bio
      </Label>
      <textarea
        id="bio"
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
        disabled={loading}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  </>
);

export default ProfileDetailsForm;
