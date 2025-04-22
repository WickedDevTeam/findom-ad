
# Authentication

The application uses Supabase Authentication for user management, session handling, and access control.

## Authentication Flow

### Sign Up
1. User navigates to `/signup`
2. User completes the signup form with email and password
3. Form submission calls `supabase.auth.signUp()` 
4. On successful signup:
   - A new user is created in `auth.users`
   - A trigger creates a matching record in `profiles`
   - User is redirected to the homepage or a welcome screen

### Sign In
1. User navigates to `/signin`
2. User enters email and password
3. Form submission calls `supabase.auth.signInWithPassword()`
4. On successful login:
   - User session is established
   - User is redirected to the homepage or previous page

### Sign Out
1. User clicks sign out button in profile menu
2. Application calls `supabase.auth.signOut()`
3. Session is terminated
4. User is redirected to homepage

## Authentication State Management

Authentication state is managed through the `AuthProvider` component and `useAuth` hook:

### AuthProvider
Located at `src/components/auth/AuthProvider.tsx`, this component:
- Initializes authentication state
- Listens for auth state changes
- Provides auth context to the entire application

```typescript
// AuthProvider.tsx simplified overview
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
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
```

### useAuth Hook
Located at `src/hooks/use-auth.tsx`, this hook:
- Provides access to auth state and methods
- Handles login, signup, and signout operations
- Provides utility methods like `requireAuth`

```typescript
// useAuth.tsx simplified overview
export function useAuth() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  // Require authentication or redirect
  const requireAuth = useCallback(() => {
    if (!authContext.user) {
      navigate('/signin');
      return false;
    }
    return true;
  }, [authContext.user, navigate]);

  // Sign in method
  const signIn = async (email, password) => {
    // Implementation
  };

  // Sign up method
  const signUp = async (email, password, userData) => {
    // Implementation
  };

  // Sign out method
  const signOut = async () => {
    // Implementation
  };

  return {
    ...authContext,
    requireAuth,
    isAuthenticated: !!authContext.user,
    signIn,
    signUp,
    signOut,
  };
}
```

## Protected Routes

The application protects certain routes that require authentication:

- `/create-listing` - Requires authentication to submit listings
- `/profile` - Requires authentication to view/edit profile
- `/favorites` - Requires authentication to view favorites
- `/admin` - Requires authentication and admin status

Protection is implemented in page components by using the `requireAuth` method:

```typescript
// Example protected route in CreateListingPage.tsx
const CreateListingPage = () => {
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Rest of component...
};
```

## Row Level Security

Supabase Row Level Security (RLS) policies restrict database access based on user authentication:

- User profiles are only accessible to the owner or admins
- User favorites are only visible to the owner
- Listing submissions can be created by any user but only managed by admins
- Notifications are only visible to the intended recipient

Example RLS policy (conceptual, actual implementation in Supabase):

```sql
-- Example: Users can only view their own favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT 
USING (auth.uid() = user_id);
```

## User Roles

The application supports two main user roles:

1. **Regular Users** - Can browse content, manage their profile, submit listings, and save favorites
2. **Administrators** - Have additional access to admin features, can review submissions, and manage site content

Admin status is determined by the `is_admin` flag in the `profiles` table and checked using the `is_admin()` database function.
