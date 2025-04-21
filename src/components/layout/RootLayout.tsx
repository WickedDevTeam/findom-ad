
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer'; // <-- already imported

const RootLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gray-950 text-white">
        <Navbar>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            data-sidebar-trigger="true"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </Navbar>
        <div className="flex flex-1 w-full relative z-0">
          <Sidebar />
          <main className="flex-1 w-full pt-[72px] transition-all duration-300 flex flex-col z-0">
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
          </main>
        </div>
        <Footer /> {/* Always sits below sidebar/content */}
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
