
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootLayout from "./components/layout/RootLayout";
import { Skeleton } from "./components/ui/skeleton";
import { AuthProvider } from "./components/auth/AuthProvider";

// Lazy load pages to reduce initial bundle size
const HomePage = lazy(() => import("./pages/HomePage"));
const CreatorDetailPage = lazy(() => import("./pages/CreatorDetailPage"));
const PromotionPage = lazy(() => import("./pages/PromotionPage"));
const CreateListingPage = lazy(() => import("./pages/CreateListingPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const SigninPage = lazy(() => import("./pages/SigninPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const MyFavoritesPage = lazy(() => import("./pages/MyFavoritesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Create a loading fallback component
const PageSkeleton = () => (
  <div className="w-full space-y-4 p-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-20 rounded-lg" />
      <Skeleton className="h-20 rounded-lg" />
      <Skeleton className="h-20 rounded-lg" />
    </div>
    <Skeleton className="h-screen w-full rounded-lg" />
  </div>
);

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unnecessary refetches when window regains focus
      staleTime: 60000, // Data considered fresh for 1 minute
      gcTime: 5 * 60 * 1000, // Cache data for 5 minutes (replacing deprecated cacheTime)
      retry: 1, // Only retry failed requests once
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
              <Route path="/promotion" element={
                <Suspense fallback={<PageSkeleton />}>
                  <PromotionPage />
                </Suspense>
              } />
              <Route path="/create-listing" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CreateListingPage />
                </Suspense>
              } />
              <Route path="/notifications" element={
                <Suspense fallback={<PageSkeleton />}>
                  <NotificationsPage />
                </Suspense>
              } />
              <Route path="/signup" element={
                <Suspense fallback={<PageSkeleton />}>
                  <SignupPage />
                </Suspense>
              } />
              <Route path="/signin" element={
                <Suspense fallback={<PageSkeleton />}>
                  <SigninPage />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<PageSkeleton />}>
                  <AdminPage />
                </Suspense>
              } />
              <Route path="/profile" element={
                <Suspense fallback={<PageSkeleton />}>
                  <ProfilePage />
                </Suspense>
              } />

              {/* CATEGORY ROUTES */}
              <Route path="/findoms" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/catfish" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/ai-bots" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/celebrities" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/twitter" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/blackmail" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/pay-pigs" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />
              <Route path="/bots" element={
                <Suspense fallback={<PageSkeleton />}>
                  <CategoryPage />
                </Suspense>
              } />

              {/* Favorites Page */}
              <Route path="/favorites" element={
                <Suspense fallback={<PageSkeleton />}>
                  <MyFavoritesPage />
                </Suspense>
              } />

              <Route path="*" element={
                <Suspense fallback={<PageSkeleton />}>
                  <NotFound />
                </Suspense>
              } />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
