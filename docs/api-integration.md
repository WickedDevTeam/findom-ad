# API Integration

This document outlines how the application integrates with backend services, primarily Supabase, for data management and authentication.

## Supabase Integration

The application uses Supabase as its primary backend service, providing:

- PostgreSQL database
- Authentication
- Storage
- Realtime subscriptions
- Edge Functions (serverless)

### Supabase Client

The Supabase client is initialized in `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qeuvbyajwdqcwwrpuigz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXZieWFqd2RxY3d3cnB1aWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTg0MjEsImV4cCI6MjA2MDc3NDQyMX0.7QNBU8jkLyj8VYyGe6IkFNTUgTn-zN53pJCqRcOWfa4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

This client is imported throughout the application for data operations:

```typescript
import { supabase } from "@/integrations/supabase/client";
```

### Database Types

TypeScript types for the database schema are defined in `src/integrations/supabase/types.ts`, which provides type safety when interacting with the database:

```typescript
export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string;
          name: string;
          // other fields...
        };
        Insert: {
          // insert types...
        };
        Update: {
          // update types...
        };
      };
      // other tables...
    };
    // views, functions, etc.
  };
};
```

## Data Fetching

The application uses a combination of direct Supabase client calls and React Query for data fetching.

### Direct Supabase Queries

Simple data fetching using the Supabase client directly:

```typescript
const fetchCreator = async (username: string) => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      creator_categories(category_id),
      creator_galleries(*)
    `)
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
};
```

### React Query Integration

React Query is used to manage more complex data fetching with caching, refetching, and loading states:

```typescript
const useCreator = (username: string) => {
  return useQuery({
    queryKey: ['creator', username],
    queryFn: () => fetchCreator(username),
    enabled: !!username,
    // Other options...
  });
};
```

### Mutation Operations

Data mutations are handled using React Query's `useMutation` hook:

```typescript
const useSubmitListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (listing: Listing) => {
      const { data, error } = await supabase
        .from('listings')
        .insert(listing);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      // Other success actions...
    },
  });
};

```

## Authentication API

Authentication operations are handled through the Supabase Auth API:

### Sign Up

```typescript
const signUp = async (email: string, password: string, userData: Record<string, any> = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: userData
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

### Sign In

```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

### Sign Out

```typescript
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    return false;
  }
};
```

## Storage API

The application handles file uploads using the Supabase Storage API:

```typescript
const uploadProfileImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `profile-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) throw error;
  
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${filePath}`;
  return imageUrl;
};
```

## Error Handling

API error handling follows a consistent pattern:

1. **Try/Catch Blocks** - For handling unexpected errors
2. **Error Objects** - Checking Supabase error responses
3. **Typed Error Responses** - Structured error objects returned from API functions
4. **Toast Notifications** - Displaying errors to users
5. **React Query Error States** - Accessing error states in components

Example error handling:

```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  
  if (error) {
    console.error('Database error:', error);
    toast.error(error.message);
    return null;
  }
  
  return data;
} catch (err) {
  console.error('Unexpected error:', err);
  toast.error('An unexpected error occurred.');
  return null;
}
```

## API Hooks

The application encapsulates API operations in custom hooks for reusability:

- `useProfile` - Profile data operations
- `useCreators` - Creator listing operations
- `useFavorites` - Favorites management
- `useListingSubmission` - Listing submission operations

This provides a consistent interface for component data needs while hiding implementation details.

## Rate Limiting and Performance

API calls implement performance optimizations:

1. **Data Caching** - Using React Query's caching system
2. **Debounced Searches** - Using `useDebouncedCallback` for search inputs
3. **Batch Operations** - Grouping related operations where possible
4. **Optimistic Updates** - Updating UI before API calls complete

## API Versioning

The application uses a fixed version of the Supabase client to ensure compatibility:

```
"@supabase/supabase-js": "^2.49.4"
```

API changes should be carefully managed to maintain compatibility with this client version.
