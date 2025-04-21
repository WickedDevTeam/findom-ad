
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Check, Image, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SocialLinks } from '@/types';

// Form schema validation
const listingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .regex(/^[a-z0-9_-]+$/, { 
      message: 'Username can only contain lowercase letters, numbers, underscores, and hyphens' 
    }),
  category: z.string({ required_error: 'Please select a category' }),
  type: z.string({ required_error: 'Please select a type' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  twitter: z.string().optional(),
  cashapp: z.string().optional(),
  onlyfans: z.string().optional(),
  throne: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

interface ListingEditorProps {
  listingId?: string;
  onSuccess?: (id: string, isNew: boolean) => void;
  onCancel?: () => void;
  isAdmin?: boolean;
}

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

const LISTING_TYPES = [
  { value: 'standard', label: 'Standard (Free)' },
  { value: 'premium', label: 'Premium' },
  { value: 'featured', label: 'Featured' },
];

export default function ListingEditor({ listingId, onSuccess, onCancel, isAdmin = false }: ListingEditorProps) {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!listingId);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<ListingFormValues>>({});

  // Form initialization
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      name: '',
      username: '',
      category: '',
      type: 'standard',
      bio: '',
      email: '',
      twitter: '',
      cashapp: '',
      onlyfans: '',
      throne: '',
      ...initialValues
    },
  });

  // Fetch existing listing data if in edit mode
  useEffect(() => {
    if (listingId) {
      const fetchListing = async () => {
        try {
          setFetchLoading(true);
          
          // For admins, check in both creators and listings tables
          let data;
          
          if (isAdmin) {
            // First check creators table
            const { data: creatorData, error: creatorError } = await supabase
              .from('creators')
              .select('*')
              .eq('id', listingId)
              .single();
              
            if (creatorData) {
              // Parse social_links from JSON if it's a string
              let socialLinks: SocialLinks = {};
              if (typeof creatorData.social_links === 'string') {
                try {
                  socialLinks = JSON.parse(creatorData.social_links);
                } catch (e) {
                  console.error('Error parsing social_links JSON:', e);
                  socialLinks = {};
                }
              } else if (creatorData.social_links && typeof creatorData.social_links === 'object') {
                socialLinks = creatorData.social_links as SocialLinks;
              }

              data = {
                name: creatorData.name,
                username: creatorData.username,
                bio: creatorData.bio,
                type: creatorData.type,
                // Map the social links
                twitter: socialLinks.twitter || '',
                cashapp: socialLinks.cashapp || '',
                onlyfans: socialLinks.onlyfans || '',
                throne: socialLinks.throne || '',
                email: '', // Email isn't stored in creators table
                category: '', // Categories are in a separate table for creators
              };
              setProfileImageUrl(creatorData.profile_image);
              
              // Get the first category for the creator
              const { data: categoryData } = await supabase
                .from('creator_categories')
                .select('category_id')
                .eq('creator_id', listingId)
                .limit(1);
                
              if (categoryData && categoryData.length > 0) {
                const { data: categoryInfo } = await supabase
                  .from('categories')
                  .select('name')
                  .eq('id', categoryData[0].category_id)
                  .single();
                  
                if (categoryInfo) {
                  data.category = categoryInfo.name;
                }
              }
            } else {
              // If not found in creators, check listings table
              const { data: listingData, error: listingError } = await supabase
                .from('listings')
                .select('*')
                .eq('id', listingId)
                .single();
                
              if (listingData) {
                data = {
                  name: listingData.name,
                  username: listingData.username,
                  bio: listingData.bio || '',
                  type: listingData.type || 'standard',
                  category: listingData.category,
                  email: listingData.email,
                  twitter: listingData.twitter || '',
                  cashapp: listingData.cashapp || '',
                  onlyfans: listingData.onlyfans || '',
                  throne: listingData.throne || '',
                };
              }
            }
          } else {
            // For users, just check listings table for their submissions
            const { data: listingData, error: listingError } = await supabase
              .from('listings')
              .select('*')
              .eq('id', listingId)
              .single();
              
            if (listingData) {
              data = {
                name: listingData.name,
                username: listingData.username,
                bio: listingData.bio || '',
                type: listingData.type || 'standard',
                category: listingData.category,
                email: listingData.email,
                twitter: listingData.twitter || '',
                cashapp: listingData.cashapp || '',
                onlyfans: listingData.onlyfans || '',
                throne: listingData.throne || '',
              };
            }
          }
          
          if (data) {
            setInitialValues(data);
            form.reset(data);
          }
        } catch (error) {
          console.error('Error fetching listing:', error);
          setError('Failed to load listing details');
        } finally {
          setFetchLoading(false);
        }
      };
      
      fetchListing();
    }
  }, [listingId, form, isAdmin]);

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

  const onSubmit = async (values: ListingFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if username is unique (except for the current listing)
      const { data: existingUsername, error: usernameError } = await supabase
        .from('creators')
        .select('id')
        .eq('username', values.username)
        .not('id', 'eq', listingId || '0')
        .maybeSingle();
      
      if (existingUsername) {
        setError('This username is already taken');
        return;
      }
      
      let profileImagePath = null;
      
      // Handle profile image upload if a new one was selected
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${values.username}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileImage, { upsert: true });
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        profileImagePath = urlData.publicUrl;
      }
      
      if (isAdmin) {
        // Admin workflow - directly update or create in the creators table
        const socialLinks = {
          twitter: values.twitter || null,
          cashapp: values.cashapp || null,
          onlyfans: values.onlyfans || null,
          throne: values.throne || null,
        };
        
        const creatorData = {
          name: values.name,
          username: values.username,
          bio: values.bio,
          type: values.type,
          social_links: socialLinks,
          is_verified: true,
          is_new: !listingId, // Only new if creating
          profile_image: profileImagePath || profileImageUrl, // Use existing or new image
        };
        
        if (listingId) {
          // Update existing creator
          const { error: updateError } = await supabase
            .from('creators')
            .update(creatorData)
            .eq('id', listingId);
            
          if (updateError) throw updateError;
          
          // If the category was changed, update it
          // First get category ID
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', values.category)
            .single();
            
          if (categoryData) {
            // Remove old categories
            await supabase
              .from('creator_categories')
              .delete()
              .eq('creator_id', listingId);
              
            // Add new category
            await supabase
              .from('creator_categories')
              .insert({
                creator_id: listingId,
                category_id: categoryData.id
              });
          }
          
          toast.success('Listing updated successfully');
          if (onSuccess) onSuccess(listingId, false);
        } else {
          // Create new creator
          const { data: newCreator, error: insertError } = await supabase
            .from('creators')
            .insert(creatorData)
            .select()
            .single();
            
          if (insertError) throw insertError;
          
          // Get category ID
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', values.category)
            .single();
            
          if (categoryData && newCreator) {
            // Add category
            await supabase
              .from('creator_categories')
              .insert({
                creator_id: newCreator.id,
                category_id: categoryData.id
              });
          }
          
          toast.success('New listing created successfully');
          if (onSuccess) onSuccess(newCreator.id, true);
        }
        
        // If we're handling a pending submission, delete it after approving
        if (listingId) {
          const { data: pendingListing } = await supabase
            .from('listings')
            .select('id')
            .eq('id', listingId)
            .maybeSingle();
            
          if (pendingListing) {
            await supabase
              .from('listings')
              .delete()
              .eq('id', listingId);
          }
        }
      } else {
        // User workflow - create or update a listing submission
        const listingData = {
          name: values.name,
          username: values.username,
          category: values.category,
          type: values.type,
          bio: values.bio,
          email: values.email,
          twitter: values.twitter || null,
          cashapp: values.cashapp || null,
          onlyfans: values.onlyfans || null,
          throne: values.throne || null,
          status: 'pending',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        };
        
        if (listingId) {
          // Update existing submission
          const { error: updateError } = await supabase
            .from('listings')
            .update(listingData)
            .eq('id', listingId);
            
          if (updateError) throw updateError;
          
          toast.success('Listing submission updated');
          if (onSuccess) onSuccess(listingId, false);
        } else {
          // Create new submission
          const { data: newListing, error: insertError } = await supabase
            .from('listings')
            .insert(listingData)
            .select()
            .single();
            
          if (insertError) throw insertError;
          
          toast.success('Listing submitted for review');
          if (onSuccess) onSuccess(newListing.id, true);
        }
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      setError(error.message || 'Failed to save listing');
      toast.error('Error saving listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2 text-lg">Loading listing data...</span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {listingId ? 'Edit Listing' : 'Create New Listing'}
        </CardTitle>
        <CardDescription>
          {isAdmin 
            ? 'Directly create or edit a listing as an admin'
            : 'Submit your listing for review by our team'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-20 w-20 mr-4 border-2 border-findom-purple">
              <AvatarImage 
                src={profileImageUrl || ''} 
                alt="Profile" 
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop';
                }}
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
                <Image className="h-4 w-4" />
                Upload Image
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Emma Watson" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. emma-watson" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique username for your profile URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The primary category for this listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || 'standard'}
                      value={field.value || 'standard'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LISTING_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {isAdmin 
                        ? 'Set the listing type (premium features may apply)'
                        : 'Free listings are approved faster'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that will appear on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {isAdmin
                      ? 'Contact email for the creator'
                      : 'We\'ll use this to notify you of your submission status'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
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
                    <FormLabel>CashApp</FormLabel>
                    <FormControl>
                      <Input placeholder="$cashapp" {...field} />
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
                      <Input placeholder="onlyfans.com/username" {...field} />
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
                    <FormLabel>Amazon Wishlist / Throne</FormLabel>
                    <FormControl>
                      <Input placeholder="throne.me/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              {onCancel && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit"
                disabled={loading}
                className="bg-findom-purple hover:bg-findom-purple/80"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading 
                  ? 'Saving...' 
                  : listingId 
                    ? 'Save Changes' 
                    : isAdmin 
                      ? 'Create Listing' 
                      : 'Submit for Review'
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
