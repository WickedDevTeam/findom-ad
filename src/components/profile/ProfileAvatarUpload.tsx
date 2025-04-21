
import React, { useState, useRef, memo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Image } from 'lucide-react';

interface ProfileAvatarUploadProps {
  avatarUrl: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = memo(({ avatarUrl, onAvatarChange }) => {
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleClearAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    // Create a fake event to clear the avatar
    const event = {
      target: {
        files: null
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onAvatarChange(event);
  };

  return (
    <div>
      <Label htmlFor="avatar-upload" className="mb-2 block font-semibold text-white">
        Profile Avatar
      </Label>
      <div className="flex items-center gap-4">
        <div 
          className="relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-offset-background ring-white/30">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-findom-purple/40 text-white">
                <Image className="w-6 h-6" />
              </AvatarFallback>
            )}
          </Avatar>
          
          {hovering && avatarUrl && (
            <button 
              onClick={handleClearAvatar}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
              aria-label="Remove avatar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col">
          <input
            ref={inputRef}
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleButtonClick}
            className="text-white"
          >
            {avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
          </Button>
          <p className="text-xs text-white/70 mt-1">
            Recommended: Square image, 500x500px or larger
          </p>
        </div>
      </div>
    </div>
  );
});

ProfileAvatarUpload.displayName = 'ProfileAvatarUpload';

export default ProfileAvatarUpload;
