# API Hooks and Data Access

This document provides detailed information about the custom React hooks used in the application for data fetching, state management, and API interactions.

## Core API Hooks

The application uses custom hooks to encapsulate API logic and provide a clean interface for components. These hooks are built on top of React Query and the Supabase client.

### Authentication Hooks

#### `useAuth`

The primary hook for authentication state and operations.

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { 
    user,            // Current user object or null
    loading,         // Authentication loading state
    isAuthenticated, // Boolean indicating if user is authenticated
    signIn,          // Function to sign in a user
    signUp,          // Function to register a new user
    signOut,         // Function to sign out the current user
    requireAuth      // Function to redirect if not authenticated
  } = useAuth();
  
  // Example usage
  if (loading) return <LoadingSpinner />;
  
  return isAuthenticated ? (
    <AuthenticatedContent user={user} onSignOut={signOut} />
  ) : (
    <UnauthenticatedContent onSignIn={signIn} onSignUp={signUp} />
  );
}
```

### Creator Data Hooks

#### `useCreator`

Fetches a single creator by username.

```typescript
import { useCreator } from "@/hooks/useCreator";

function CreatorProfile({ username }) {
  const { 
    data: creator, 
    isLoading, 
    error 
  } = useCreator(username);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!creator) return <NotFound />;
  
  return <CreatorProfileDisplay creator={creator} />;
}
```

#### `useCreators`

Fetches multiple creators with optional filtering.

```typescript
import { useCreators } from "@/hooks/useCreators";

function CreatorsList({ category, searchTerm, limit = 10 }) {
  const { 
    data: creators, 
    isLoading, 
    error,
    hasNextPage,
    fetchNextPage
  } = useCreators({ category, searchTerm, limit });
  
  // Infinite scroll or pagination handling
}
```

#### `useFeaturedCreators`

Fetches creators that are marked as featured.

```typescript
import { useFeaturedCreators } from "@/hooks/useFeaturedCreators";

function FeaturedCreatorsSection() {
  const { 
    data: featuredCreators, 
    isLoading 
  } = useFeaturedCreators();
  
  // Render featured creators
}
```

### User Data Hooks

#### `useProfile`

Fetches and manages the current user's profile.

```typescript
import { useProfile } from "@/hooks/useProfile";

function ProfileSettings() {
  const { 
    profile, 
    isLoading, 
    updateProfile,  // Mutation to update profile
    isUpdating      // Update in progress
  } = useProfile();
  
  // Profile form and update handling
}
```

#### `useProfileAvatar`

Manages the user's profile avatar.

```typescript
import { useProfileAvatar } from "@/hooks/useProfileAvatar";

function AvatarUploader() {
  const { 
    avatarUrl, 
    uploadAvatar,   // Function to upload a new avatar
    isUploading,    // Upload in progress
    error           // Upload error
  } = useProfileAvatar();
  
  // Avatar upload UI
}
```

#### `useProfileInterests`

Manages user profile interests.

```typescript
import { useProfileInterests } from "@/hooks/useProfileInterests";

function InterestsSelector() {
  const { 
    interests, 
    updateInterests, // Function to update interests
    availableInterests, // All available interests
    isUpdating       // Update in progress
  } = useProfileInterests();
  
  // Interests selection UI
}
```

### Favorites Management Hooks

#### `useFavorites`

Fetches the current user's favorite creators.

```typescript
import { useFavorites } from "@/hooks/useFavorites";

function MyFavorites() {
  const { 
    favorites, 
    isLoading, 
    error 
  } = useFavorites();
  
  // Render favorites list
}
```

#### `useIsFavorite`

Checks if a specific creator is favorited by the current user.

```typescript
import { useIsFavorite } from "@/hooks/useIsFavorite";

function FavoriteButton({ creatorId }) {
  const { 
    isFavorite, 
    isLoading, 
    toggleFavorite  // Function to toggle favorite status
  } = useIsFavorite(creatorId);
  
  // Render favorite toggle button
}
```

### Listing Submission Hooks

#### `useListingSubmission`

Manages the creation and submission of new creator listings.

```typescript
import { useListingSubmission } from "@/hooks/useListingSubmission";

function ListingSubmissionForm() {
  const { 
    submitListing,   // Function to submit a new listing
    isSubmitting,    // Submission in progress
    error,           // Submission error
    reset            // Reset the submission state
  } = useListingSubmission();
  
  // Listing submission form
}
```

### Admin Hooks

#### `useAdminSubmissions`

Fetches and manages listing submissions for admin review.

```typescript
import { useAdminSubmissions } from "@/hooks/useAdminSubmissions";

function AdminSubmissionsPanel() {
  const { 
    submissions, 
    isLoading, 
    approveListing,  // Function to approve a listing
    rejectListing,   // Function to reject a listing
    isProcessing     // Action in progress
  } = useAdminSubmissions();
  
  // Admin submissions UI
}
```

#### `useAdminDashboard`

Fetches statistics and data for the admin dashboard.

```typescript
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

function AdminDashboard() {
  const { 
    stats, 
    isLoading 
  } = useAdminDashboard();
  
  // Admin dashboard UI with stats
}
```

### Notification Hooks

#### `useNotifications`

Fetches and manages user notifications.

```typescript
import { useNotifications } from "@/hooks/useNotifications";

function NotificationsPanel() {
  const { 
    notifications, 
    unreadCount,
    isLoading, 
    markAsRead,      // Function to mark a notification as read
    markAllAsRead    // Function to mark all notifications as read
  } = useNotifications();
  
  // Notifications UI
}
```

## Utility Hooks

### `useToast`

Provides access to the toast notification system.

```typescript
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast, success, error } = useToast();
  
  const handleAction = async () => {
    try {
      await performAction();
      success("Action completed successfully!");
    } catch (err) {
      error("Failed to complete action.");
    }
  };
  
  // Component implementation
}
```

### `useIsMobile`

Detects if the current viewport is mobile-sized.

```typescript
import { useIsMobile } from "@/hooks/use-mobile";

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return isMobile ? (
    <MobileView />
  ) : (
    <DesktopView />
  );
}
```

### `useDebouncedCallback`

Creates a debounced version of a callback function.

```typescript
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const debouncedSearch = useDebouncedCallback((term) => {
    performSearch(term);
  }, 300);
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };
  
  // Search input implementation
}
```

## Data Fetching Patterns

### Basic Query Pattern

The typical pattern for data fetching follows this structure:

```typescript
export function useDataHook(params) {
  return useQuery({
    queryKey: ["uniqueKey", ...Object.values(params)],
    queryFn: () => fetchData(params),
    enabled: !!requiredParam, // Conditional execution
    // Other options...
  });
}

// Implementation
async function fetchData(params) {
  const { data, error } = await supabase
    .from("tableName")
    .select("*")
    .eq("field", params.value);
    
  if (error) throw error;
  return data;
}
```

### Mutation Pattern

Data mutations follow this general pattern:

```typescript
export function useDataMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from("tableName")
        .insert(data);
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["affectedData"] });
      // Other success actions...
    },
  });
}
```

### Infinite Query Pattern

For paginated or infinite scroll data:

```typescript
export function useInfiniteDataHook(params) {
  return useInfiniteQuery({
    queryKey: ["infiniteData", params],
    queryFn: ({ pageParam = 0 }) => fetchPage(params, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === params.limit ? allPages.length : undefined;
    },
    // Other options...
  });
}

async function fetchPage(params, page) {
  const { limit = 10 } = params;
  const from = page * limit;
  
  const { data, error } = await supabase
    .from("tableName")
    .select("*")
    .range(from, from + limit - 1);
    
  if (error) throw error;
  return data;
}
```

## Best Practices

### Error Handling

Consistent error handling across hooks:

```typescript
try {
  const { data, error } = await supabase.from("table").select("*");
  
  if (error) {
    console.error("Database error:", error);
    throw error; // Let React Query handle the error
  }
  
  return data;
} catch (err) {
  console.error("Unexpected error:", err);
  throw err; // Propagate to React Query
}
```

### Authentication Checks

Checking authentication before data operations:

```typescript
const checkAuth = () => {
  const user = supabase.auth.user();
  if (!user) throw new Error("Authentication required");
  return user.id;
};

async function fetchProtectedData() {
  const userId = checkAuth();
  // Continue with data fetch using userId
}
```

### Optimistic Updates

Implementing optimistic updates for better UX:

```typescript
const toggleFavorite = useMutation({
  mutationFn: async (/* params */) => {
    // API call to toggle favorite
  },
  onMutate: async (/* params */) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["favorites"] });
    
    // Snapshot previous value
    const previousFavorites = queryClient.getQueryData(["favorites"]);
    
    // Optimistically update
    queryClient.setQueryData(["favorites"], (old) => {
      // Return modified data
    });
    
    return { previousFavorites };
  },
  onError: (err, variables, context) => {
    // Restore previous data on error
    queryClient.setQueryData(["favorites"], context.previousFavorites);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  },
});
```

## Extending the API Layer

When adding new features that require data access, follow these steps:

1. **Create a new hook**: Define a custom hook with a clear name and purpose
2. **Use React Query**: Leverage useQuery or useMutation for data operations
3. **Handle errors**: Implement consistent error handling
4. **Type definitions**: Create TypeScript types for the data and parameters
5. **Documentation**: Document the hook's purpose, parameters, and return values
6. **Testing**: Implement tests for the hook's functionality

Example of adding a new feature hook:

```typescript
// src/hooks/useFeatureData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FeatureData, FeatureParams } from "@/types";

// Fetch feature data
export function useFeatureData(params: FeatureParams) {
  return useQuery({
    queryKey: ["featureData", params],
    queryFn: () => fetchFeatureData(params),
    enabled: !!params.requiredParam,
  });
}

// Update feature data
export function useUpdateFeatureData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFeatureData,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["featureData", { requiredParam: variables.requiredParam }] 
      });
    },
  });
}

// Implementation details
async function fetchFeatureData(params: FeatureParams): Promise<FeatureData[]> {
  // Implementation...
}

async function updateFeatureData(data: FeatureData): Promise<FeatureData> {
  // Implementation...
}
```
