import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '../shared/Logo';
import { Bell, Search as SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
const Navbar = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };
  return <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto sm:px-6 flex justify-between items-center py-[12px] px-0">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo />
          {children}
        </div>
        
        {/* Center-aligned search form */}
        <div className="hidden sm:flex flex-1 justify-center px-4 max-w-md mx-auto">
          <form onSubmit={onSearch} className="w-full">
            <Input className="w-full bg-black/30 border-white/10 focus:bg-black/40 focus:border-findom-purple transition-all" type="text" placeholder="Search creators..." value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          </form>
        </div>
        
        {/* Mobile search icon */}
        <div className="sm:hidden flex-1 flex justify-center">
          <button aria-label="Open search" className={clsx("rounded-full p-2 hover:bg-black/30 transition focus:outline-none", searchOpen && "bg-black/40")} onClick={() => setSearchOpen(o => !o)}>
            <SearchIcon className="w-5 h-5 text-white" />
          </button>
          {searchOpen && <form onSubmit={onSearch} className="absolute left-0 top-full w-full px-4 mt-2 z-50">
              <Input className="w-full bg-black/70 border-white/10 focus:bg-black/80 focus:border-findom-purple transition-all" type="text" placeholder="Search creators..." value={searchValue} onChange={e => setSearchValue(e.target.value)} autoFocus />
            </form>}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-findom-purple">3</Badge>
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
          <Button variant="outline" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile searchbox when active */}
      {searchOpen && <div className="sm:hidden px-4 pb-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={onSearch} className="w-full">
            <Input className="w-full bg-black/30 border-white/10 focus:bg-black/40 focus:border-findom-purple transition-all" type="text" placeholder="Search creators..." value={searchValue} onChange={e => setSearchValue(e.target.value)} autoFocus />
          </form>
        </div>}
    </header>;
};
export default Navbar;