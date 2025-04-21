import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import { Link, useLocation } from 'react-router-dom';
import SidebarUserProfile from './SidebarUserProfile';
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
        <SidebarGroup className="py-0 my-0">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <span className="text-xl">🏠</span>
                    <span className="font-normal text-base text-left">Back Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {CATEGORY_LINKS.map(link => <SidebarMenuItem key={link.to} className="py-0">
                  <SidebarMenuButton asChild isActive={location.pathname === link.to}>
                    <Link to={link.to} className="py-0 my-0">
                      <span className="text-xl">{link.emoji}</span>
                      <span className="text-left font-normal px-0 mx-0 text-base">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarUserProfile />
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>;
};
export default FindomSidebar;