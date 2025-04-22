
# State Management

The application uses a combination of state management approaches to handle different aspects of application state.

## State Management Strategy

The application employs a hybrid state management approach:

1. **Server State** - Managed with React Query
2. **Authentication State** - Managed with React Context
3. **UI State** - Managed with local component state
4. **Form State** - Managed with React Hook Form
5. **Navigation State** - Managed with React Router

This strategy separates concerns and uses the most appropriate tool for each type of state.

## Server State Management

### React Query

The application uses Tanstack Query (React Query) for managing server state:

```typescript
// React Query configuration in App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Usage in components
const { data, isLoading, error } = useQuery({
  queryKey: ['creators', category],
  queryFn: () => fetchCreators(category),
});
```

Key features of the React Query implementation:

- **Query Keys** - Structured keys for caching and invalidation
- **Automatic Refetching** - Configurable refetching on window focus, intervals
- **Caching** - Data caching with configurable staleness
- **Mutations** - Optimistic updates with rollback
- **Status Tracking** - Loading, error, and success states

### Example: Favorites Management

The favorites functionality demonstrates React Query for both queries and mutations:

```typescript
// Query hook for checking if a creator is favorited
const useIsFavorite = (creatorId: string) => {
  return useQuery({
    queryKey: ["favorite", creatorId],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) return false;
      
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("creator_id", creatorId)
        .maybeSingle();
      
      return !!data;
    },
  });
};

// Mutation hook for toggling favorite status
const useToggleFavorite = (creatorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFav: boolean) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("Not logged in.");
      if (!isFav) {
        // Add favorite
        const { error } = await supabase.from("favorites").insert({
          user_id: userId,
          creator_id: creatorId,
        });
        if (error) throw error;
      } else {
        // Remove favorite
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("creator_id", creatorId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["favorite", creatorId] });
      queryClient.invalidateQueries({ queryKey: ["myFavorites"] });
    },
  });
};
```

## Authentication State

Authentication state is managed through React Context with the `AuthProvider` component and `useAuth` hook:

```typescript
// Context definition
export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming auth state
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    // Additional auth methods
  };
}
```

This approach provides:
- Centralized authentication state
- Consistent access to user information
- Authentication-related utility methods

## UI State Management

Various UI state needs are handled with appropriate methods:

### Sidebar State

Sidebar visibility is managed with a dedicated context provider:

```typescript
// SidebarProvider manages the visibility state
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// useSidebar hook provides access to sidebar state
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
```

### Responsive State

Device responsiveness is handled with the `useIsMobile` hook:

```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}
```

### Toast Notifications

Notifications use the `useToast` hook with Shadcn's toast system:

```typescript
export function useToast() {
  const { toast } = useToast();
  
  return {
    toast,
    success: (message: string) => {
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
    },
    error: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    // Other toast types...
  };
}
```

## Form State Management

Forms are managed using React Hook Form with Zod for validation:

```typescript
// Example form implementation
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
  control,
} = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    // Other default values...
  },
});

const onSubmit = async (data: FormValues) => {
  // Process form submission
};
```

This approach provides:
- Controlled inputs with validation
- Form state tracking (dirty, touched, errors)
- Submission handling
- Performance optimization through uncontrolled components

## State Persistence

The application uses several mechanisms for state persistence:

1. **Supabase Database** - Primary data storage
2. **Supabase Auth** - Session persistence
3. **React Query Cache** - Temporary data caching
4. **URL Parameters** - State in the URL (e.g., category filters)

## Performance Considerations

The state management approach includes several performance optimizations:

- **Memoization** - Using `useMemo` and `useCallback` for expensive computations
- **Query Deduplication** - React Query prevents duplicate requests
- **Lazy Loading** - Components and pages are loaded on demand
- **Debouncing** - Input handling is debounced for search and filters

## Debugging State

The application includes debugging capabilities for state:

- React Query Devtools (when in development mode)
- Console logging for critical state changes
- Error boundaries for UI recovery

## Feature Flags

The application can use feature flags to control access to new or experimental features. This is implemented through:

1. **Database Configuration** - Feature flags stored in the `site_config` table
2. **Context Provider** - A FeatureFlagsProvider to expose flags throughout the app
3. **Custom Hook** - A `useFeatureFlag` hook to check if features are enabled

Example usage:
```typescript
// In a component
const isNewFeatureEnabled = useFeatureFlag('new-feature');

return (
  <div>
    {isNewFeatureEnabled ? (
      <NewFeatureComponent />
    ) : (
      <LegacyComponent />
    )}
  </div>
);
```

## Supabase Realtime Updates

For real-time collaborative features, the application leverages Supabase's Realtime functionality:

```typescript
useEffect(() => {
  // Subscribe to changes
  const channel = supabase
    .channel('table-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'tablename'
      },
      (payload) => {
        // Handle new data
        console.log('New record:', payload.new);
        // Update local state or trigger refresh
      }
    )
    .subscribe();

  // Cleanup subscription
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```
