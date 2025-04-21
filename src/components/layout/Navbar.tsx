
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/shared/Logo';
import NavbarProfileMenu from './NavbarProfileMenu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-gray-950 border-b border-gray-800 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {children}
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <NavbarProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
