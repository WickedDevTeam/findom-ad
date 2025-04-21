
import React from "react";
import { Check, Zap, Inbox, X } from "lucide-react";
import clsx from "clsx";

// Color/styles for status badges (mockup-accurate)
const STATUS_MAP = {
  success: {
    border: "border-[#18d28f]",
    bg: "bg-[#071910]",
    text: "text-[#18d28f]",
    glow: "shadow-[0_0_12px_0_#18d28f55]",
    icon: <Check size={18} strokeWidth={2.2} className="mr-1" />,
  },
  pending: {
    border: "border-[#b08819]",
    bg: "bg-[#181309]",
    text: "text-[#ffc527]",
    glow: "shadow-[0_0_12px_0_#ffc52733]",
    icon: <Zap size={18} strokeWidth={2.2} className="mr-1" />,
  },
  submitted: {
    border: "border-[#5d64d9]",
    bg: "bg-[#10132b]",
    text: "text-[#A8B6FC]",
    glow: "shadow-[0_0_12px_0_#A8B6FC33]",
    icon: <Inbox size={18} strokeWidth={2.2} className="mr-1" />,
  },
  danger: {
    border: "border-[#8e1542]",
    bg: "bg-[#24121e]",
    text: "text-[#ffb3e1]",
    glow: "shadow-[0_0_12px_0_#ffb3e127]",
    icon: <X size={18} strokeWidth={2.2} className="mr-1" />,
  },
};

type AppBadgeVariant =
  | "success"      // green, check
  | "pending"      // yellow, zap, formerly "warning"
  | "submitted"    // blue, inbox
  | "danger"       // pink/red, x, formerly "failed" or "error"
  // fallbacks:
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
  categoryName?: string; // for unique category coloring
}

const BADGE_PILL =
  "inline-flex items-center rounded-full px-4 py-1 gap-1 min-h-[36px] font-semibold transition-all duration-150 text-base border shadow focus:outline-none";

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // 1. Exact status badges
  if ((["success", "pending", "submitted", "danger"] as string[]).includes(variant)) {
    const style = STATUS_MAP[variant as keyof typeof STATUS_MAP];
    return (
      <span
        className={clsx(
          BADGE_PILL,
          style.bg,
          style.text,
          style.border,
          style.glow,
          "select-none",
          "backdrop-blur-sm",
          onClick && "cursor-pointer",
          className
        )}
        style={{
          letterSpacing: 0,
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          fontWeight: 600,
          fontSize: 18,
          borderWidth: 2,
        }}
        onClick={onClick}
      >
        {icon !== undefined ? icon : style.icon}
        <span className="truncate">{children}</span>
      </span>
    );
  }
  // 2. Fallback for all other badge types (non-status)
  // Use a soft, subtle style so they don't clash with new badges
  return (
    <span
      className={clsx(
        BADGE_PILL,
        "bg-black/20 text-white/80 border border-white/10 shadow",
        "select-none",
        onClick && "cursor-pointer",
        className
      )}
      style={{
        letterSpacing: "0.01em",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        fontWeight: 600,
        fontSize: 16,
        borderWidth: 1.5,
      }}
      onClick={onClick}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
