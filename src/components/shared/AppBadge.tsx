
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

/**
 * Revamped modern, highly-readable category badge colors using glassmorphism and clear, pleasing palettes.
 */
const CATEGORY_COLORS: Record<string, string> = {
  Findoms:    "bg-[#865DDA]/80 border-[#BE9EFF] text-white/90",
  Catfish:    "bg-[#41C8E9]/20 border-[#41C8E9] text-[#35B6D7]",
  "AI Bots":  "bg-[#95F6E6]/20 border-[#2BE3C3] text-[#38BCAA]",
  "Pay Pigs": "bg-[#FFDDA2]/40 border-[#FFB860] text-[#D8931A]",
  Celebrities: "bg-[#FFCEF5]/25 border-[#FF70BE] text-[#CE1E7F]",
  Blackmail:  "bg-[#EAADBC]/40 border-[#EAADBC] text-[#8B4257]",
  Twitter:    "bg-[#B0D2FC]/25 border-[#498AE2] text-[#1564C0]",
  Bots:       "bg-[#9e94ee]/15 border-[#7E69AB] text-[#705AA0]",
  Other:      "bg-white/5 border-white/20 text-white/70"
};

type AppBadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "category"
  | "type"
  | "vip"
  | "featured"
  | "default";

const ICONS = {
  success: <Check className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
  danger: <X className="w-4 h-4" />,
  featured: <Check className="w-4 h-4" />,
  vip: <Check className="w-4 h-4" />,
};

interface AppBadgeProps {
  children: React.ReactNode;
  variant?: AppBadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  categoryName?: string; // for unique category coloring
}

const badgeStyles = {
  success: "bg-[#3ed098]/20 border-[#42c88b] text-[#3ed098]",
  warning: "bg-[#ffe1af]/30 border-[#FFD180] text-[#D5A348]",
  info:    "bg-[#b0d2fc]/20 border-[#62A6F7] text-[#2471C7]",
  danger:  "bg-[#fff0f0]/40 border-[#FF7A85] text-[#D43645]",
  category: "", // set below with CATEGORY_COLORS
  type: "bg-[#c8bafe]/18 border-[#A085F9] text-[#7C57D4]",
  featured: "bg-[#B49DF9]/25 border-[#A085F9] text-[#57419E]",
  vip: "bg-[#FEDE89]/40 border-[#FEDE89] text-[#B19646]",
  default: "bg-black/30 border-white/10 text-white/80",
};

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // Use polished glass style for category variant if categoryName is provided
  const isCategory = variant === "category";
  const isType = variant === "type";
  const customClass =
    isCategory && categoryName && CATEGORY_COLORS[categoryName]
      ? CATEGORY_COLORS[categoryName]
      : badgeStyles[variant];

  // Only show an icon for non-category badges; never for category
  const IconComponent =
    icon !== undefined
      ? icon
      : (!isCategory && variant in ICONS
        ? ICONS[variant as keyof typeof ICONS]
        : null);

  return (
    <span
      className={clsx(
        // Universal badge look: pill, smooth font, subtle border+bg, spacing, some hover
        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 min-h-[28px] min-w-0 text-xs font-semibold shadow-sm ring-0 select-none transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-findom-purple/30",
        "hover:shadow-md hover:scale-[1.04]",
        // subtle glass effect + shadow for dark backgrounds
        "backdrop-blur-md",
        isType ? "capitalize tracking-wide" : "",
        customClass,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{
        lineHeight: "1.18",
        boxShadow: isCategory
          ? "0 2px 8px 0 rgba(40,35,80,0.18)"
          : "none",
        letterSpacing: ".01em",
      }}
    >
      {/* Never show any icon for categories! */}
      {!isCategory && IconComponent && (
        <span className="opacity-80 flex items-center">{IconComponent}</span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;

