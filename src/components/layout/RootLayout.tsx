import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
const RootLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="min-h-screen bg-findom-dark text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <Navbar>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </Navbar>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="md:pl-[208px] pt-[72px] min-h-screen transition-all duration-300">
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
        }} className="container mx-auto sm:px-6 py-8 px-[89px]">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>;
};
export default RootLayout;