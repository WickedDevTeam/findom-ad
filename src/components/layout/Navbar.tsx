
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '../shared/Logo';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-40 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Mobile menu toggle if present */}
          {children}
          
          {/* Logo - always visible on both mobile and desktop */}
          <div className="flex items-center">
            <Logo />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-findom-purple text-white">3</Badge>
            </Button>
          </Link>
          
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/promotion" className="text-white/80 hover:text-white">
              Promotion
            </Link>
          </Button>
          
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/create-listing" className="text-white/80 hover:text-white">
              Create Listing
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="border-findom-purple/60 hover:bg-findom-purple/20 transition-colors">
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
