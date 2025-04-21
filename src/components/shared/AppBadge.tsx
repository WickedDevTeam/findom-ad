
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

/**
 * Slightly more vibrant, harmonious category badge colors.
 * Each is a custom pastel+vibrant hue chosen for pleasing contrast per user.
 */
const CATEGORY_COLORS: Record<string, string> = {
  Findoms:    "border-[#A88BFE] text-[#A88BFE] bg-[#F5F2FF]/50 hover:bg-[#A88BFE]/10",     // Violet
  Catfish:    "border-[#4FC3EA] text-[#4FC3EA] bg-[#E8F7FB]/40 hover:bg-[#4FC3EA]/10",     // Blue-cyan
  "AI Bots":  "border-[#51CD9B] text-[#51CD9B] bg-[#E3FCEF]/40 hover:bg-[#51CD9B]/10",     // Mint green
  "Pay Pigs": "border-[#FEAC70] text-[#FEAC70] bg-[#FFF5E6]/50 hover:bg-[#FEAC70]/10",     // Peach
  Celebrities: "border-[#F97EA1] text-[#F97EA1] bg-[#FFF0F6]/50 hover:bg-[#F97EA1]/10",    // Soft pink
  Blackmail:  "border-[#EAADBC] text-[#EAADBC] bg-[#FAF1F4]/60 hover:bg-[#EAADBC]/10",     // Muted rose
  Twitter:    "border-[#85A9F9] text-[#85A9F9] bg-[#EEF4FE]/50 hover:bg-[#85A9F9]/10",     // Blue
  Bots:       "border-[#B6A3E4] text-[#B6A3E4] bg-[#F2EEFB]/45 hover:bg-[#B6A3E4]/10",     // Soft violet
  Other:      "border-[#E1E1E1] text-[#CCCCCC] bg-[#30313C]/30 hover:bg-[#363647]/10"
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
  // Slightly upped vibrancy for non-category badges
  success: "border-[#5CCC91] text-[#5CCC91] bg-[#EDF9F3]/60 hover:bg-[#5CCC91]/10",
  warning: "border-[#FFD180] text-[#FFD180] bg-[#FFF6E3]/60 hover:bg-[#FFD180]/10",
  info:    "border-[#62A6F7] text-[#62A6F7] bg-[#ECF4FB]/70 hover:bg-[#62A6F7]/10",
  danger:  "border-[#FF7A85] text-[#FF7A85] bg-[#FFF1F2]/60 hover:bg-[#FF7A85]/10",
  category: "", // set below with CATEGORY_COLORS
  type: "border-[#A085F9] text-[#A085F9] bg-[#F5F2FF]/60 hover:bg-[#A085F9]/10", // purple
  featured: "border-[#B49DF9] text-[#B49DF9] bg-[#F1EDFF]/60 hover:bg-[#B49DF9]/10",
  vip: "border-[#FEDE89] text-[#FEDE89] bg-[#FFF7DE]/50 hover:bg-[#FEDE89]/10",
  default: "border-white/15 text-white/80 bg-black/10 hover:bg-white/5",
};

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // Use vibrant color for category variant if categoryName is provided
  const isCategory = variant === "category";
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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 min-h-[32px] min-w-0 text-sm font-semibold shadow-none ring-0 select-none transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-findom-purple/30",
        "hover:shadow-md hover:scale-[1.04]", // slight interactive feedback
        customClass,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{ lineHeight: "1.2" }}
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
