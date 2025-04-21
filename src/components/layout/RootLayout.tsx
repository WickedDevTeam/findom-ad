
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';

const RootLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen text-white bg-gray-950">
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
        
        <Sidebar />
        
        <main className="md:pl-[208px] pt-[72px] min-h-screen transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.3 }} 
              className="container mx-auto px-3 sm:px-6 py-4 sm:py-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
