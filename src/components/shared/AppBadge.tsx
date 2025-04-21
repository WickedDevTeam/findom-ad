
import React from "react";
import { Check, Zap, Inbox, X, Badge as BadgeIcon, Tag } from "lucide-react";
import clsx from "clsx";

// Status badge styles for system states with vibrant colors
const STATUS_MAP = {
  success: {
    border: "border-[#18d28f]/80",
    bg: "bg-[#18d28f]/10",
    text: "text-[#18d28f]",
    glow: "shadow-[0_0_8px_0_#18d28f30]",
    icon: <Check size={14} strokeWidth={2.5} className="mr-1" />,
  },
  pending: {
    border: "border-[#ffc527]/80",
    bg: "bg-[#ffc527]/10",
    text: "text-[#ffc527]",
    glow: "shadow-[0_0_8px_0_#ffc52730]",
    icon: <Zap size={14} strokeWidth={2.5} className="mr-1" />,
  },
  submitted: {
    border: "border-[#5d64d9]/80",
    bg: "bg-[#5d64d9]/10",
    text: "text-[#A8B6FC]",
    glow: "shadow-[0_0_8px_0_#A8B6FC30]",
    icon: <Inbox size={14} strokeWidth={2.5} className="mr-1" />,
  },
  danger: {
    border: "border-[#A23B7C]/80",
    bg: "bg-[#A23B7C]/10",
    text: "text-[#ffb3e1]",
    glow: "shadow-[0_0_8px_0_#ffb3e130]",
    icon: <X size={14} strokeWidth={2.5} className="mr-1" />,
  },
};

// Mapping for category colors
const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  Findom: {
    border: "border-[#9b87f5]/80",
    bg: "bg-[#9b87f5]/10",
    text: "text-[#E5DEFF]",
  },
  Catfish: {
    border: "border-[#F97316]/80",
    bg: "bg-[#F97316]/10",
    text: "text-[#FDE1D3]",
  },
  "AI Bots": {
    border: "border-[#0EA5E9]/80",
    bg: "bg-[#0EA5E9]/10",
    text: "text-[#D3E4FD]",
  },
  Celebrities: {
    border: "border-[#D946EF]/80",
    bg: "bg-[#D946EF]/10",
    text: "text-[#FFDEE2]",
  },
  Twitter: {
    border: "border-[#1DA1F2]/80",
    bg: "bg-[#1DA1F2]/10",
    text: "text-[#D3E4FD]",
  },
  Blackmail: {
    border: "border-[#EA384C]/80",
    bg: "bg-[#EA384C]/10",
    text: "text-[#FFDEE2]",
  },
  "Pay Pigs": {
    border: "border-[#F97316]/80",
    bg: "bg-[#F97316]/10",
    text: "text-[#FDE1D3]",
  },
  default: {
    border: "border-[#8B5CF6]/80",
    bg: "bg-[#8B5CF6]/10",
    text: "text-[#E5DEFF]",
  },
};

type AppBadgeVariant =
  | "success"
  | "pending"
  | "submitted"
  | "danger"
  | "category"
  | "type"
  | "vip"
  | "featured"
  | "default";

interface AppBadgeProps {
  children: React.ReactNode;
  variant?: AppBadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  categoryName?: string;
}

// Updated pill style to match mockup screenshot with vibrant colors
const BASE_PILL =
  "inline-flex items-center rounded-full px-3 py-1 gap-1 min-h-[28px] font-medium transition-all duration-150 text-sm border backdrop-blur-sm select-none";
// Extra style when clickable
const CLICKABLE = "cursor-pointer hover:shadow-sm hover:bg-black/90";

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // 1. Status badge styles preserved for system states
  if (["success", "pending", "submitted", "danger"].includes(variant)) {
    const style = STATUS_MAP[variant as keyof typeof STATUS_MAP];
    return (
      <span
        className={clsx(
          BASE_PILL,
          style.bg,
          style.text,
          style.border,
          onClick && CLICKABLE,
          className
        )}
        style={{
          fontWeight: 500,
          fontSize: 14,
          borderWidth: 1,
          letterSpacing: "0.05em",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={onClick}
      >
        {icon !== undefined ? icon : style.icon}
        <span className="truncate">{children}</span>
      </span>
    );
  }
  
  // 2. Category badge with dynamic colors based on category name
  if (variant === "category") {
    // Get category-specific styling or use default
    const catName = categoryName || (typeof children === 'string' ? children : 'default');
    const style = CATEGORY_COLORS[catName] || CATEGORY_COLORS.default;
    
    return (
      <span
        className={clsx(
          BASE_PILL,
          "uppercase text-xs tracking-wider font-semibold",
          style.border,
          style.bg,
          style.text,
          onClick && CLICKABLE,
          className
        )}
        style={{
          fontWeight: 600,
          fontSize: 12,
          borderWidth: 1,
          letterSpacing: "0.1em",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={onClick}
      >
        {icon !== undefined ? icon : <Tag size={12} className="mr-1 opacity-80" />}
        <span className="truncate">{children}</span>
      </span>
    );
  }
  
  // 3. Type badge (e.g., Blackmail) with vibrant styling
  if (variant === "type") {
    return (
      <span
        className={clsx(
          BASE_PILL,
          "uppercase text-xs tracking-wider font-semibold border-[#0EA5E9]/80 bg-[#0EA5E9]/10 text-[#D3E4FD]",
          onClick && CLICKABLE,
          className
        )}
        style={{
          fontWeight: 600,
          fontSize: 12,
          borderWidth: 1,
          letterSpacing: "0.1em",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={onClick}
      >
        {icon !== undefined ? icon : <Tag size={12} className="mr-1 opacity-80" />}
        <span className="truncate">{children}</span>
      </span>
    );
  }
  
  // 4. Featured badge
  if (variant === "featured") {
    return (
      <span
        className={clsx(
          BASE_PILL,
          "border-[#D946EF]/80 bg-[#D946EF]/10 text-[#D946EF]",
          onClick && CLICKABLE,
          className
        )}
        style={{
          fontWeight: 500,
          fontSize: 14,
          borderWidth: 1,
          letterSpacing: "0.05em",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={onClick}
      >
        {icon !== undefined ? icon : <BadgeIcon size={14} className="mr-1 opacity-80" />}
        <span className="truncate">{children}</span>
      </span>
    );
  }
  
  // 5. Default badge (fallback for any other variant)
  return (
    <span
      className={clsx(
        BASE_PILL,
        "border-[#8B5CF6]/80 bg-[#8B5CF6]/10 text-[#E5DEFF]",
        onClick && CLICKABLE,
        className
      )}
      style={{
        fontWeight: 500,
        fontSize: 14,
        borderWidth: 1,
        letterSpacing: "0.05em",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={onClick}
    >
      {icon !== undefined ? icon : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
