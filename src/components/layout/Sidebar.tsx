
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import NavbarProfileMenu from '@/components/layout/NavbarProfileMenu';
import { Link, useLocation } from 'react-router-dom';

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

// Note: The new Sidebar component manages open/close state itself with SidebarProvider in RootLayout
const FindomSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-2 pt-3 pb-3">
          <Logo forSidebar />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <span className="text-xl">🏠</span>
                    <span>Back Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {CATEGORY_LINKS.map(link => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton asChild isActive={location.pathname === link.to}>
                    <Link to={link.to}>
                      <span className="text-xl">{link.emoji}</span>
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <NavbarProfileMenu />
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default FindomSidebar;
