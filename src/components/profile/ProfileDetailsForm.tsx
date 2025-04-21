
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileDetailsFormProps {
  displayName: string;
  setDisplayName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  email: string;
  bio: string;
  setBio: (value: string) => void;
  loading: boolean;
  errors: {
    displayName?: string;
    username?: string;
    bio?: string;
  };
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  displayName,
  setDisplayName,
  username,
  setUsername,
  email,
  bio,
  setBio,
  loading,
  errors
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
          maxLength={50}
          className={errors.displayName ? "border-red-500" : ""}
        />
        {errors.displayName && (
          <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
        )}
      </div>

      {/* Username (now editable) */}
      <div>
        <Label htmlFor="username" className="block font-semibold text-white mb-1">
          Username
        </Label>
        <Input 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="Your username"
          disabled={loading}
          maxLength={30}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username ? (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        ) : (
          <p className="text-xs text-white/70 mt-1">
            Only lowercase letters, numbers, and underscores
          </p>
        )}
      </div>
    </div>

    {/* Email (read-only) */}
    <div>
      <Label htmlFor="email" className="block font-semibold text-white mb-1">
        Email
      </Label>
      <Input id="email" value={email} disabled placeholder="Your email" />
      <p className="text-xs text-white/70 mt-1">
        Email address cannot be changed here
      </p>
    </div>

    {/* Bio */}
    <div>
      <Label htmlFor="bio" className="block font-semibold text-white mb-1">
        Bio
      </Label>
      <Textarea
        id="bio"
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
        disabled={loading}
        maxLength={500}
        className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.bio ? "border-red-500" : ""}`}
      />
      {errors.bio ? (
        <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
      ) : (
        <p className="text-xs text-white/70 mt-1">
          {bio.length}/500 characters
        </p>
      )}
    </div>
  </>
);

export default ProfileDetailsForm;
