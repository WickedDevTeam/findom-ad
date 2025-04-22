
# Application Routes

The application uses React Router v6 for client-side routing. All routes are defined in `src/App.tsx`.

## Route Structure

The application has a nested route structure:

- All main routes are wrapped in a `RootLayout` component that provides the sidebar, navbar, and overall page structure
- Page components are lazy-loaded using React's `lazy` and `Suspense` to optimize initial load time
- A `PageSkeleton` component is shown during page loading

## Primary Routes

| Path | Component | Description | Auth Required |
|------|-----------|-------------|--------------|
| `/` | `HomePage` | Main landing page with featured creators and categories | No |
| `/creator/:username` | `CreatorDetailPage` | Detailed view of a specific creator | No |
| `/promotion` | `PromotionPage` | Promotional packages and featured listings | No |
| `/create-listing` | `CreateListingPage` | Form to submit a new listing | Yes |
| `/notifications` | `NotificationsPage` | User notifications center | Yes |
| `/signup` | `SignupPage` | New user registration | No |
| `/signin` | `SigninPage` | User login | No |
| `/admin` | `AdminPage` | Admin dashboard and tools | Yes (Admin) |
| `/profile` | `ProfilePage` | User profile management | Yes |
| `/favorites` | `MyFavoritesPage` | User's saved favorite creators | Yes |

## Category Routes

These routes show filtered creator listings by category:

| Path | Component | Description |
|------|-----------|-------------|
| `/findoms` | `CategoryPage` | Findom category listings |
| `/catfish` | `CategoryPage` | Catfish category listings |
| `/ai-bots` | `CategoryPage` | AI bots category listings |
| `/celebrities` | `CategoryPage` | Celebrities category listings |
| `/twitter` | `CategoryPage` | Twitter category listings |
| `/blackmail` | `CategoryPage` | Blackmail category listings |
| `/pay-pigs` | `CategoryPage` | Pay pigs category listings |
| `/bots` | `CategoryPage` | Bots category listings |

## Route Implementation

The routes are defined in `App.tsx` using React Router:

```tsx
<Routes>
  <Route element={<RootLayout />}>
    <Route path="/" element={
      <Suspense fallback={<PageSkeleton />}>
        <HomePage />
      </Suspense>
    } />
    <Route path="/creator/:username" element={
      <Suspense fallback={<PageSkeleton />}>
        <CreatorDetailPage />
      </Suspense>
    } />
    {/* Additional routes... */}
    <Route path="*" element={
      <Suspense fallback={<PageSkeleton />}>
        <NotFound />
      </Suspense>
    } />
  </Route>
</Routes>
```

## Route Guards

Certain routes are protected by authentication guards:

1. **Component-Level Guards** - Pages like `CreateListingPage` include a check that redirects unauthenticated users:
   ```tsx
   if (!user) {
     return <Navigate to="/signin" replace />;
   }
   ```

2. **Hook-Based Guards** - Some components use the `requireAuth` method from the `useAuth` hook.

## Route Parameters

Several routes use URL parameters:

- `/creator/:username` - Display a creator profile by username
- Category pages like `/findoms` use the route path to determine which category to display

## Navigation

Navigation between routes is handled through:

1. **Link Components** - Standard navigation using React Router's `Link` component
2. **Programmatic Navigation** - Using the `useNavigate` hook for conditional or event-based navigation
3. **Sidebar Menu** - Primary navigation through the application sidebar

## Route Transitions

Route transitions are enhanced with Framer Motion animations:

```tsx
<AnimatePresence mode="wait">
  <motion.div 
    key={location.pathname} 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="flex-1 flex flex-col justify-start px-3 sm:px-6 py-4 sm:py-8"
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

This provides a smooth visual transition between pages, enhancing the user experience.
