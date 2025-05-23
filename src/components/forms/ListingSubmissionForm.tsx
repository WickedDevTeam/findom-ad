
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';

// Form schema validation
const listingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters long' }).optional(),
  twitter: z.string().optional(),
  throne: z.string().optional(),
  cashapp: z.string().optional(),
  onlyfans: z.string().optional(),
  category: z.string().min(1, { message: 'Please select a category' }),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const CATEGORIES = [
  { value: 'Findoms', label: 'Findoms' },
  { value: 'Catfish', label: 'Catfish' },
  { value: 'AI Bots', label: 'AI Bots' },
  { value: 'Celebrities', label: 'Celebrities' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Blackmail', label: 'Blackmail' },
  { value: 'Pay Pigs', label: 'Pay Pigs' },
  { value: 'Bots', label: 'Bots' },
];

const ListingSubmissionForm = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if avatars bucket exists
  const { data: bucketsData } = useQuery({
    queryKey: ['avatarsBucket'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      return data;
    },
  });

  const avatarBucketExists = bucketsData?.some(bucket => bucket.name === 'avatars');

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      twitter: '',
      throne: '',
      cashapp: '',
      onlyfans: '',
      category: '',
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const onSubmit = async (data: ListingFormValues) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError('You must be logged in to submit a listing');
        setLoading(false);
        toast({
          title: "Authentication error",
          description: "Please sign in to submit a listing",
          variant: "destructive"
        });
        return;
      }

      const user = userData.user;
      let profileImagePath = null;
      
      // Handle profile image upload if selected
      if (profileImage) {
        try {
          // Check if the storage bucket exists
          if (!avatarBucketExists) {
            console.error('Avatars bucket does not exist');
            toast({
              title: "Storage error",
              description: "Storage configuration error. Please contact support.",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
          
          const fileExt = profileImage.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, profileImage, { upsert: true });
            
          if (uploadError) {
            console.error('Error uploading profile image:', uploadError);
            setError('Failed to upload profile image: ' + uploadError.message);
            setLoading(false);
            return;
          }
          
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
            
          profileImagePath = urlData.publicUrl;
        } catch (uploadError: any) {
          console.error('Error in image upload process:', uploadError);
          setError('Image upload error: ' + uploadError.message);
          setLoading(false);
          return;
        }
      }
      
      // Generate a username based on user ID to satisfy the database constraint
      const generatedUsername = `user_${user.id.substring(0, 8)}`;
      
      // Prepare listing data with improved validation and error handling
      const listingData = {
        name: data.name,
        category: data.category,
        bio: data.bio || '',
        email: data.email,
        twitter: data.twitter || null,
        cashapp: data.cashapp || null,
        onlyfans: data.onlyfans || null,
        throne: data.throne || null,
        status: 'pending',
        profile_image: profileImagePath,
        user_id: user.id,
        is_public: false,
        is_deleted: false,
        has_pending_changes: false,
        username: generatedUsername,
        type: 'standard',
        submitted_at: new Date().toISOString(),
      };
      
      // Insert with improved error handling
      const { error: insertError } = await supabase
        .from('listings')
        .insert(listingData);
          
      if (insertError) {
        console.error('Error submitting listing:', insertError);
        setError(insertError.message || 'Failed to submit listing');
        toast({
          title: "Submission error",
          description: "Failed to submit listing: " + insertError.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Listing submitted",
        description: "Listing submitted successfully! We will review it shortly.",
        variant: "default"
      });
      form.reset();
      setProfileImage(null);
      setProfileImageUrl(null);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to submit listing: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 overflow-auto">
      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-100/10 rounded-md text-red-500">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-findom-purple">
            <AvatarImage 
              src={profileImageUrl || ''} 
              alt="Profile" 
              className="object-cover"
            />
            <AvatarFallback className="bg-findom-purple text-white text-xl">
              {form.getValues().name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <label 
              htmlFor="profileImage" 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-findom-purple/70 hover:bg-findom-purple text-white cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Profile Image
            </label>
            <input 
              id="profileImage" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
            <p className="text-xs text-white/60 mt-1">
              Maximum 5MB. JPG, PNG or GIF.
            </p>
          </div>
        </div>
      </div>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-black px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell potential admirers about yourself..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter/X</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="throne"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Throne</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Throne wishlist URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cashapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cashapp</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Cashapp username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="onlyfans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OnlyFans</FormLabel>
                    <FormControl>
                      <Input placeholder="Your OnlyFans URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full md:w-auto bg-findom-purple hover:bg-findom-purple/80"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Listing'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ListingSubmissionForm;
