
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }).regex(/^[a-z0-9-]+$/, {
    message: 'Username can only contain lowercase letters, numbers, and hyphens.',
  }),
  bio: z.string().min(10, {
    message: 'Bio must be at least 10 characters.',
  }),
  twitter: z.string().optional(),
  throne: z.string().optional(),
  cashapp: z.string().optional(),
  onlyfans: z.string().optional(),
  other: z.string().optional(),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  type: z.string({
    required_error: 'Please select a listing type.',
  }),
});

const CreateListingPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      twitter: '',
      throne: '',
      cashapp: '',
      onlyfans: '',
      other: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success('Listing submitted for review!', {
      description: 'We will review your listing and get back to you soon.',
    });
    form.reset();
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Create a Listing</h1>
        <p className="text-white/70">
          Submit your information to create a new listing. All submissions will be reviewed before being published.
        </p>
      </div>

      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
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
                      <Input placeholder="your-username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in your profile URL.
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
                      placeholder="Write a short bio about yourself..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="catfish">Catfish</SelectItem>
                        <SelectItem value="findoms">Findoms</SelectItem>
                        <SelectItem value="celebrities">Celebrities</SelectItem>
                        <SelectItem value="blackmail">Blackmail</SelectItem>
                        <SelectItem value="ai-bots">AI Bots</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Social Links</h3>
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
                        <Input placeholder="https://throne.com/yourusername" {...field} />
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
                        <Input placeholder="https://cash.app/yourusername" {...field} />
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
                        <Input placeholder="https://onlyfans.com/yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Submit Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateListingPage;
