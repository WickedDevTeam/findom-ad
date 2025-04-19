
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '../shared/Logo';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-[208px] right-0 bg-black/80 backdrop-blur-md z-40 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/promotion" className="text-white/80 hover:text-white">
              Promotion
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signup">Signup</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
