
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Twitter, Zap, DollarSign, Fish, Star, Crown, PiggyBank } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="w-[208px] h-screen bg-black border-r border-white/10 fixed left-0 top-0 z-50">
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-2 flex-1">
          <SidebarItem 
            to="/" 
            icon={<Home className="w-5 h-5" />} 
            label="Back Home" 
            isActive={location.pathname === '/'}
          />
          <SidebarItem 
            to="/twitter" 
            icon={<Twitter className="w-5 h-5" />} 
            label="(X) Twitter" 
            isActive={location.pathname === '/twitter'}
          />
          <SidebarItem 
            to="/bots" 
            icon={<Zap className="w-5 h-5" />} 
            label="AI Bots" 
            isActive={['/bots', '/ai-bots'].includes(location.pathname)}
          />
          <SidebarItem 
            to="/blackmail" 
            icon={<DollarSign className="w-5 h-5" />} 
            label="Blackmail" 
            isActive={location.pathname === '/blackmail'}
          />
          <SidebarItem 
            to="/catfish" 
            icon={<Fish className="w-5 h-5" />} 
            label="Catfish" 
            isActive={location.pathname === '/catfish'}
          />
          <SidebarItem 
            to="/celebrities" 
            icon={<Star className="w-5 h-5" />} 
            label="Celebrities" 
            isActive={location.pathname === '/celebrities'}
          />
          <SidebarItem 
            to="/findoms" 
            icon={<Crown className="w-5 h-5" />} 
            label="Findoms" 
            isActive={location.pathname === '/findoms'}
          />
          <SidebarItem 
            to="/pay-pigs" 
            icon={<PiggyBank className="w-5 h-5" />} 
            label="Pay Pigs" 
            isActive={location.pathname === '/pay-pigs'}
          />
        </nav>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarItem = ({ to, icon, label, isActive = false }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
        ${isActive 
          ? 'text-white bg-findom-purple/20 border-l-2 border-findom-purple' 
          : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
