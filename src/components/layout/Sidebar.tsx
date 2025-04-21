
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
import Logo from '@/components/shared/Logo';
import {
  InfoCard,
  InfoCardContent,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardFooter as InfoCardFooterUI,
  InfoCardDismiss,
  InfoCardAction,
} from '@/components/ui/info-card';

// Category links (same as before)
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
      {/* Logo pinned at the very top, always visible */}
      <div className="sticky top-0 z-30 bg-sidebar/90 w-full flex items-center justify-center py-4 backdrop-blur-xl border-b border-sidebar-border">
        <Logo forSidebar className="mx-auto" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Main menu */}
            <SidebarMenu>
              {/* "Back Home" */}
              <SidebarMenuItem key="back-home">
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <span className="text-xl">🏠</span>
                    <span>Back Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Category links */}
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
        {/* InfoCard (Announcement): refined, matches your demo.tsx */}
        <div className="mt-3 px-2">
          <InfoCard>
            <InfoCardContent>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-[14px] h-[14px] bg-blue-500 rounded-full animate-ping" />
                <div className="absolute -top-4 -right-4 w-[14px] h-[14px] bg-blue-500 rounded-full" />
                <InfoCardTitle>Simple Announcement</InfoCardTitle>
                <InfoCardDescription>
                  This is a simple announcement without any media content.
                </InfoCardDescription>
                <InfoCardFooterUI>
                  <InfoCardDismiss>Dismiss</InfoCardDismiss>
                  <InfoCardAction>
                    <a
                      href="#"
                      className="flex flex-row items-center gap-1 underline"
                      tabIndex={-1}
                    >
                      Read more
                    </a>
                  </InfoCardAction>
                </InfoCardFooterUI>
              </div>
            </InfoCardContent>
          </InfoCard>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          {/* User profile/settings at bottom, consistently styled */}
          {user ? (
            <>
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
                <ChevronsUpDown className="h-5 w-5 rounded-md" />
              </SidebarMenuButton>
              <SidebarMenuButton onClick={signOut} className="w-full mt-1">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </SidebarMenuButton>
            </>
          ) : (
            <SidebarMenuButton 
              className="w-full justify-center h-12" 
              onClick={() => navigate('/signup')}
            >
              <span>Sign In</span>
            </SidebarMenuButton>
          )}
        </SidebarGroup>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;

