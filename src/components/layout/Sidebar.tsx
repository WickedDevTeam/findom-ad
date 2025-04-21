import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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
const FindomSidebar = () => {
  const location = useLocation();
  return <Sidebar className="z-20">
      <SidebarContent>
        <div className="px-2 pt-3 pb-3">
          <Logo forSidebar hideInHeader={false} />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <span className="text-xl">🏠</span>
                    <span className="font-normal text-lg">Back Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {CATEGORY_LINKS.map(link => <SidebarMenuItem key={link.to} className="py-px">
                  <SidebarMenuButton asChild isActive={location.pathname === link.to}>
                    <Link to={link.to}>
                      <span className="text-xl">{link.emoji}</span>
                      <span className="font-medium text-lg text-left">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <NavbarProfileMenu />
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>;
};
export default FindomSidebar;