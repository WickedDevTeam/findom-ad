
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

// Wrap the page in SidebarProvider and restore two-column layout
const RootLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-950 text-white">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-screen">
          <Navbar>
            {/* Sidebar mobile trigger button */}
            <SidebarTrigger className="md:hidden" />
          </Navbar>
          <main className="pt-[72px] flex-1 transition-all duration-300">
            <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
