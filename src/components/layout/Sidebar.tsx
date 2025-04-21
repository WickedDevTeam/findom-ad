
import React from "react";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { InfoCard, InfoCardContent, InfoCardTitle, InfoCardDescription, InfoCardFooter as InfoCardFooterEl, InfoCardDismiss, InfoCardAction } from "@/components/ui/info-card";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  ExternalLink,
  User,
  ChevronsUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    emoji: "🏠",
  },
  {
    title: "Inbox",
    url: "/notifications",
    icon: Inbox,
    emoji: "📬",
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    emoji: "📅",
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
    emoji: "🔍",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    emoji: "⚙️",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
}: SidebarProps) => {
  const { user, signOut, isAuthenticated } = useAuth();
  
  const email = user?.email || 'user@example.com';
  const displayName = user?.user_metadata?.full_name || email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <UISidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <span className="mr-2">{item.emoji}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <InfoCard>
          <InfoCardContent>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] bg-blue-500 rounded-full animate-ping" />
              <div className="absolute -top-4 -right-4 w-[14px] h-[14px] bg-blue-500 rounded-full" />
              <InfoCardTitle>Simple Announcement</InfoCardTitle>
              <InfoCardDescription>
                This is a simple announcement without any media content.
              </InfoCardDescription>
              <InfoCardFooterEl>
                <InfoCardDismiss>Dismiss</InfoCardDismiss>
                <InfoCardAction>
                  <a
                    href="#"
                    className="flex flex-row items-center gap-1 underline"
                  >
                    Read more <ExternalLink size={12} />
                  </a>
                </InfoCardAction>
              </InfoCardFooterEl>
            </div>
          </InfoCardContent>
        </InfoCard>
        <SidebarGroup>
          <SidebarMenuButton 
            className="w-full justify-between gap-3 h-12"
            onClick={isAuthenticated ? undefined : () => window.location.href = '/signup'}
          >
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-findom-purple/40">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5 rounded-md" />
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{isAuthenticated ? displayName : 'Sign In'}</span>
                {isAuthenticated && (
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {email}
                  </span>
                )}
              </div>
            </div>
            {isAuthenticated && <ChevronsUpDown className="h-5 w-5 rounded-md" />}
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarFooter>
    </UISidebar>
  );
};

export default Sidebar;
