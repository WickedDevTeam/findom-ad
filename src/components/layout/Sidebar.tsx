
import React from 'react';
import {
  Sidebar as ShadcnSidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { User, ChevronsUpDown } from 'lucide-react';

const CATEGORY_LINKS = [
  { to: '/findoms', emoji: '👑', label: 'Findoms' },
  { to: '/pay-pigs', emoji: '🐷', label: 'Pay Pigs' },
  { to: '/catfish', emoji: '🐟', label: 'Catfish' },
  { to: '/ai-bots', emoji: '🤖', label: 'AI Bots' },
  { to: '/twitter', emoji: '🐦', label: '(X) Twitter' },
  { to: '/celebrities', emoji: '🌟', label: 'Celebrities' },
  { to: '/blackmail', emoji: '💸', label: 'Blackmail' },
  { to: '/bots', emoji: '⚡️', label: 'Bots' },
];

import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="back-home">
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <span className="text-xl">🏠</span>
                    <span>Back Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {CATEGORY_LINKS.map(link => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === link.to}
                  >
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
        {user && (
          <SidebarGroup>
            <SidebarMenuButton className="w-full justify-between gap-3 h-12 cursor-default">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 rounded-md" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.user_metadata?.full_name || user.email?.split('@')[0]?.toUpperCase() || "User"}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-5 w-5 rounded-md" />
            </SidebarMenuButton>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
