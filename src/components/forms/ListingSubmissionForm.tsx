
import React from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Form schema validation
const listingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .regex(/^[a-z0-9_-]+$/, {
      message: 'Username can only contain lowercase letters, numbers, underscores, and hyphens'
    }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters long' }).optional(),
  twitter: z.string().optional(),
  throne: z.string().optional(),
  cashapp: z.string().optional(),
  onlyfans: z.string().optional(),
  other: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const ListingSubmissionForm = () => {
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      bio: '',
      twitter: '',
      throne: '',
      cashapp: '',
      onlyfans: '',
      other: '',
    }
  });
  
  const onSubmit = (data: ListingFormValues) => {
    // Here we'll integrate with backend later
    console.log('Form submitted:', data);
    toast.success('Listing submitted successfully! We will review it shortly.');
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-20rem)] max-h-[800px] w-full">
      <div className="p-4">
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
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button type="submit" size="lg" className="w-full md:w-auto bg-findom-purple hover:bg-findom-purple/80">
              Submit Listing
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default ListingSubmissionForm;
