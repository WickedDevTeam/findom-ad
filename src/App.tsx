
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import CreatorDetailPage from "./pages/CreatorDetailPage";
import PromotionPage from "./pages/PromotionPage";
import CreateListingPage from "./pages/CreateListingPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/NotificationsPage";
import CategoryPage from "./pages/CategoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/creator/:username" element={<CreatorDetailPage />} />
            <Route path="/promotion" element={<PromotionPage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Category Routes */}
            <Route path="/findoms" element={<CategoryPage />} />
            <Route path="/catfish" element={<CategoryPage />} />
            <Route path="/ai-bots" element={<CategoryPage />} />
            <Route path="/celebrities" element={<CategoryPage />} />
            <Route path="/twitter" element={<CategoryPage />} />
            <Route path="/blackmail" element={<CategoryPage />} />
            <Route path="/pay-pigs" element={<CategoryPage />} />
            <Route path="/bots" element={<CategoryPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
