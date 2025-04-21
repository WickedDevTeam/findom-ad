
import React from "react";
import { Check, Zap, Inbox, X, Badge as BadgeIcon, Tag } from "lucide-react";
import clsx from "clsx";

// Harmonized Status badge styling preserved (for: success/pending/submitted/danger)
const STATUS_MAP = {
  success: {
    border: "border-[#18d28f]",
    bg: "bg-[#071910]/70",
    text: "text-[#18d28f]",
    glow: "shadow-[0_0_8px_0_#18d28f48]",
    icon: <Check size={18} strokeWidth={2.2} className="mr-1" />,
  },
  pending: {
    border: "border-[#b08819]",
    bg: "bg-[#181309]/70",
    text: "text-[#ffc527]",
    glow: "shadow-[0_0_8px_0_#ffc52744]",
    icon: <Zap size={18} strokeWidth={2.2} className="mr-1" />,
  },
  submitted: {
    border: "border-[#5d64d9]",
    bg: "bg-[#10132b]/80",
    text: "text-[#A8B6FC]",
    glow: "shadow-[0_0_8px_0_#A8B6FC44]",
    icon: <Inbox size={18} strokeWidth={2.2} className="mr-1" />,
  },
  danger: {
    border: "border-[#8e1542]",
    bg: "bg-[#2c131e]/75",
    text: "text-[#ffb3e1]",
    glow: "shadow-[0_0_8px_0_#ffb3e177]",
    icon: <X size={18} strokeWidth={2.2} className="mr-1" />,
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

// Mockup-matching pill base (for all non-status tags)
const BEAUTY_PILL =
  "inline-flex items-center rounded-full px-4 py-1.5 gap-1 min-h-[36px] font-bold transition-all duration-150 text-base border select-none backdrop-blur-md bg-black/50 shadow-[0_2px_12px_0_rgba(0,0,0,0.15)] border-white/10 text-white uppercase tracking-wide";
// Extra style when clickable
const CLICKABLE = "cursor-pointer hover:shadow-xl hover:bg-white/10";

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // 1. Status badge styles preserved for system states (success/pending/submitted/danger)
  if (["success", "pending", "submitted", "danger"].includes(variant)) {
    const style = STATUS_MAP[variant as keyof typeof STATUS_MAP];
    return (
      <span
        className={clsx(
          BEAUTY_PILL,
          style.bg,
          style.text,
          style.border,
          style.glow,
          onClick && CLICKABLE,
          className
        )}
        style={{
          fontWeight: 700,
          fontSize: 16,
          borderWidth: 2,
          letterSpacing: "0.07em",
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
  // 2. All other badges (category, type, featured, etc) use unified styling
  let badgeIcon = null;
  if (variant === "category") {
    badgeIcon = <Tag size={16} className="mr-1 opacity-70" />;
  } else if (variant === "featured") {
    badgeIcon = <BadgeIcon size={16} className="mr-1 opacity-70" />;
  } else if (variant === "type") {
    badgeIcon = <Tag size={16} className="mr-1 opacity-70" />;
  }
  // You could style other variants' icons here as well

  return (
    <span
      className={clsx(
        BEAUTY_PILL,
        onClick && CLICKABLE,
        className
      )}
      style={{
        fontWeight: 700,
        fontSize: 16,
        borderWidth: 1.5,
        letterSpacing: "0.07em",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={onClick}
    >
      {icon !== undefined ? icon : badgeIcon}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;

