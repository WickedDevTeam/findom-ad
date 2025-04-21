
import React from 'react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { User, ChevronsUpDown, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavbarProfileMenu from './NavbarProfileMenu';

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

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
        {user ? (
          <SidebarGroup>
            <SidebarMenuButton 
              className="w-full justify-between gap-3 h-12" 
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 rounded-md" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.user_metadata?.full_name || user.email?.split('@')[0]?.toUpperCase() || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-5 w-5" />
            </SidebarMenuButton>
            
            <SidebarMenuButton onClick={signOut} className="w-full mt-1">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarMenuButton 
              className="w-full justify-center" 
              onClick={() => navigate('/signup')}
            >
              <span>Sign In</span>
            </SidebarMenuButton>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
