import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '../shared/Logo';
import { Bell, Search as SearchIcon, X } from 'lucide-react';
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  // Focus the search input when it's opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  return <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-3 sm:px-6 flex justify-between items-center h-[72px]">
        <div className="flex items-center gap-1 sm:gap-4">
          {children}
          <Logo hideInHeader={false} />
        </div>
        
        {/* Center-aligned search form - hidden on mobile */}
        <div className="hidden sm:flex flex-1 justify-center px-4 max-w-md mx-auto">
          <form onSubmit={onSearch} className="w-full">
            <Input className="w-full bg-black/30 border-white/10 focus:bg-black/40 focus:border-findom-purple transition-all" type="text" placeholder="Search creators..." value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          </form>
        </div>
        
        {/* Mobile search icon */}
        <div className="sm:hidden flex-1 flex justify-center">
          <button aria-label={searchOpen ? "Close search" : "Open search"} className={clsx("rounded-full p-2 hover:bg-black/30 transition focus:outline-none", searchOpen && "bg-black/40")} onClick={() => setSearchOpen(o => !o)}>
            {searchOpen ? <X className="w-5 h-5 text-white" /> : <SearchIcon className="w-5 h-5 text-white" />}
          </button>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-4">
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white p-1 sm:p-2">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 bg-findom-purple rounded-full flex items-center justify-center p-0">3</Badge>
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
          <Button variant="outline" asChild className="hidden xs:flex">
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
      
      {searchOpen && <div className="sm:hidden px-3 pb-3 bg-black/80 backdrop-blur-md">
          <form onSubmit={onSearch} className="w-full relative">
            <Input ref={searchInputRef} className="w-full bg-black/30 border-white/10 focus:bg-black/40 focus:border-findom-purple transition-all rounded-xl h-12" type="text" placeholder="Search creators..." value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          </form>
        </div>}
    </header>;
};
export default Navbar;