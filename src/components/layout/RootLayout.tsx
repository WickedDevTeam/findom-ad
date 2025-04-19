
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-findom-dark text-white">
      <Sidebar />
      <Navbar />
      <main className="pl-[208px] pt-[72px] min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
