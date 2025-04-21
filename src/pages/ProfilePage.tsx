
import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileAvatarUpload from '@/components/profile/ProfileAvatarUpload';
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm';
import ProfileInterestsSelector from '@/components/profile/ProfileInterestsSelector';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/use-auth';

const ProfilePage = () => {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  // Handle authentication check once
  useEffect(() => {
    if (!authLoading) {
      const isAuthenticated = requireAuth();
      setAuthChecked(isAuthenticated);
    }
  }, [authLoading, requireAuth]);

  // Only initialize profile hooks after auth check
  const {
    displayName, setDisplayName,
    username, setUsername,
    email,
    bio, setBio,
    avatarUrl, onAvatarChange,
    loading, initialLoading, savingProfile,
    handleSave,
    categories, interests, toggleInterest, categoriesLoading,
    errors,
  } = useProfile();

  if (authLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="w-8 h-8 animate-spin text-findom-purple" />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="w-8 h-8 animate-spin text-findom-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-sidebar-dark rounded-md mt-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <div className="space-y-6">
        <ProfileAvatarUpload 
          avatarUrl={avatarUrl} 
          onAvatarChange={onAvatarChange} 
        />

        <ProfileDetailsForm
          displayName={displayName}
          setDisplayName={setDisplayName}
          username={username}
          setUsername={setUsername}
          email={email}
          bio={bio}
          setBio={setBio}
          loading={loading || savingProfile}
          errors={errors}
        />

        <ProfileInterestsSelector
          categories={categories}
          interests={interests}
          toggleInterest={toggleInterest}
          loading={categoriesLoading}
        />

        <div>
          <Button 
            onClick={handleSave} 
            disabled={loading || savingProfile} 
            size="lg" 
            className="w-full md:w-auto"
          >
            {savingProfile ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
