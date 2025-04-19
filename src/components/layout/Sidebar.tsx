
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Twitter, Zap, DollarSign, Fish, Star, Crown, PiggyBank } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-[208px] h-screen bg-black border-r border-white/10 fixed left-0 top-0 z-50">
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-2 flex-1">
          <SidebarItem to="/" icon={<Home className="w-5 h-5" />} label="Back Home" />
          <SidebarItem to="/twitter" icon={<Twitter className="w-5 h-5" />} label="(X) Twitter" />
          <SidebarItem to="/bots" icon={<Zap className="w-5 h-5" />} label="AI Bots" />
          <SidebarItem to="/blackmail" icon={<DollarSign className="w-5 h-5" />} label="Blackmail" />
          <SidebarItem to="/catfish" icon={<Fish className="w-5 h-5" />} label="Catfish" />
          <SidebarItem to="/celebrities" icon={<Star className="w-5 h-5" />} label="Celebrities" />
          <SidebarItem to="/findoms" icon={<Crown className="w-5 h-5" />} label="Findoms" />
          <SidebarItem to="/pay-pigs" icon={<PiggyBank className="w-5 h-5" />} label="Pay Pigs" />
        </nav>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ to, icon, label }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
