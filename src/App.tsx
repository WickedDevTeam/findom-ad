import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AuthContext } from '@/components/auth/AuthProvider';
import HomePage from '@/pages/HomePage';
import SigninPage from '@/pages/SigninPage';
import SignupPage from '@/pages/SignupPage';
import ProfilePage from '@/pages/ProfilePage';
import CreateListingPage from '@/pages/CreateListingPage';
import AdminPage from '@/pages/AdminPage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import TOSPage from '@/pages/TOSPage';
import PrivacyPage from '@/pages/PrivacyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { Toaster } from 'sonner';

const App = () => {
  const AuthChecker = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
      return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
      return <Navigate to="/signin" />;
    }

    return children;
  };

  const AdminAuthChecker = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
      return <div>Loading...</div>; // Or a spinner
    }

    // Replace this with your actual admin check logic
    const isAdmin = user?.email === 'admin@example.com';

    if (!isAdmin) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/tos" element={<TOSPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/listing/:listingId" element={<ListingDetailPage />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <AuthChecker>
                <ProfilePage />
              </AuthChecker>
            }
          />
          <Route
            path="/create-listing"
            element={
              <AuthChecker>
                <CreateListingPage />
              </AuthChecker>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminAuthChecker>
                <AdminPage />
              </AdminAuthChecker>
            }
          />

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster richColors />
      </Router>
    </AuthProvider>
  );
};

export default App;
