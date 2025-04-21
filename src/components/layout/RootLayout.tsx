import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';
const RootLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  return <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full text-white overflow-x-hidden bg-zinc-950">
        <Navbar>
          <Button variant="ghost" size="icon" className="md:hidden" data-sidebar-trigger="true">
            <Menu className="h-5 w-5" />
          </Button>
        </Navbar>
        <div className="flex flex-1 w-full relative">
          <Sidebar />
          <main className="flex-1 w-full pt-[72px] transition-all duration-300 flex flex-col min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} transition={{
              duration: 0.3
            }} className="flex-1 flex flex-col justify-start px-3 sm:px-6 py-4 sm:py-8">
                <Outlet />
              </motion.div>
            </AnimatePresence>
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default RootLayout;