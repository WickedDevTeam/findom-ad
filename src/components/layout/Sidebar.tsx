
import React from "react";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/notifications",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
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
  return (
    <UISidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="mr-2" />
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
          <SidebarMenuButton className="w-full justify-between gap-3 h-12">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 rounded-md" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">KL</span>
                <span className="text-xs text-muted-foreground">
                  kl@example.com
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-5 w-5 rounded-md" />
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarFooter>
    </UISidebar>
  );
};

export default Sidebar;
