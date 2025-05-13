
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CreatorDetailPage from "./pages/CreatorDetailPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import CreateListingPage from "./pages/CreateListingPage";
import AuthProvider from "./components/auth/AuthProvider";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import PromotionPage from "./pages/PromotionPage";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotionConfigPage from "./pages/NotionConfigPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="creators/:username" element={<CreatorDetailPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin/notion-config" element={<NotionConfigPage />} />
              <Route path="signin" element={<SigninPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="create-listing" element={<CreateListingPage />} />
              <Route path="favorites" element={<MyFavoritesPage />} />
              <Route path="promotion" element={<PromotionPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
