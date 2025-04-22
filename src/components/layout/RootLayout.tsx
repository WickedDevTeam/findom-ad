
import React, { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';

interface RootLayoutProps {
  children?: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col w-full text-white overflow-x-hidden bg-zinc-950">
        <Navbar />
        <div className="flex flex-1 w-full relative">
          <Sidebar />
          <RootContent location={location}>
            {children}
          </RootContent>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Separated component to use the useSidebar hook
const RootContent = ({ location, children }: { 
  location: ReturnType<typeof useLocation>;
  children?: ReactNode;
}) => {
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <main 
      className={`flex-1 w-full pt-[72px] transition-all duration-300 flex flex-col min-h-screen ${
        open && !isMobile ? 'md:pl-[16rem]' : ''
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col justify-start px-3 sm:px-6 py-4 sm:py-8"
        >
          {children || <Outlet />}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </main>
  );
};

export default RootLayout;
