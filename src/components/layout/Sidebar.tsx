
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';

const CATEGORY_LINKS = [{
  to: '/findoms',
  emoji: '👑',
  label: 'Findoms'
}, {
  to: '/pay-pigs',
  emoji: '🐷',
  label: 'Pay Pigs'
}, {
  to: '/catfish',
  emoji: '🐟',
  label: 'Catfish'
}, {
  to: '/ai-bots',
  emoji: '🤖',
  label: 'AI Bots'
}, {
  to: '/twitter',
  emoji: '🐦',
  label: '(X) Twitter'
}, {
  to: '/celebrities',
  emoji: '🌟',
  label: 'Celebrities'
}, {
  to: '/blackmail',
  emoji: '💸',
  label: 'Blackmail'
}, {
  to: '/bots',
  emoji: '⚡️',
  label: 'Bots'
}];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const location = useLocation();
  
  return (
    <aside 
      className={`w-[85%] max-w-[280px] md:w-[208px] h-screen fixed left-0 top-0 pt-[72px] bg-black border-r border-white/10 z-40 transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex flex-col h-[calc(100%-72px)] p-0 overflow-y-auto">
        <div className="flex flex-col items-center mt-2 mb-3 md:hidden">
          <Logo forSidebar />
        </div>
        
        {/* Mobile close button */}
        <div className="flex justify-end md:hidden px-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="space-y-0.5 flex-1 mt-1 my-[5px] px-0"> 
          <SidebarItem 
            to="/" 
            icon={<span className="text-xl">🏠</span>} 
            label="Back Home" 
            isActive={location.pathname === '/'} 
            onClick={onClose} 
          />
          
          {CATEGORY_LINKS.map(link => (
            <SidebarItem 
              key={link.to} 
              to={link.to} 
              icon={<span className="text-xl">{link.emoji}</span>} 
              label={link.label} 
              isActive={location.pathname === link.to} 
              onClick={onClose} 
            />
          ))}
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
  onClick?: () => void;
}

const SidebarItem = ({
  to,
  icon,
  label,
  isActive = false,
  onClick
}: SidebarItemProps) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
        ${isActive ? 'text-white bg-findom-purple/20 border-l-2 border-findom-purple' : 'text-white/80 hover:text-white hover:bg-white/10'}`} 
      onClick={onClick}
    >
      {icon}
      <span className="text-slate-50 text-base font-normal text-left truncate">{label}</span>
    </Link>
  );
};

export default Sidebar;
