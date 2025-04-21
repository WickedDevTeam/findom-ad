
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

// Color styles for each category, carefully chosen for pastel/modern palette.
const CATEGORY_COLORS: Record<string, string> = {
  Findoms:    "border-[#E5DEFF] text-[#B49DF9] bg-[#E5DEFF]/10", // soft purple
  Catfish:    "border-[#0EA5E9] text-[#0EA5E9] bg-[#D3E4FD]/10", // blue
  "AI Bots":  "border-[#50C878] text-[#50C878] bg-[#F2FCE2]/10", // green
  "Pay Pigs": "border-[#F97316] text-[#F97316] bg-[#FEF7CD]/10", // orange/yellow
  Celebrities: "border-[#D946EF] text-[#D946EF] bg-[#FBE7FD]/10", // magenta
  Blackmail:  "border-[#EA384C] text-[#EA384C] bg-[#FFD6DD]/10", // red
  Twitter:    "border-[#517fa4] text-[#517fa4] bg-[#D3E4FD]/10", // steel blue
  Bots:       "border-[#FFA99F] text-[#FFA99F] bg-[#FFE29F]/10", // peach
  Other:      "border-white/40 text-white/80 bg-white/10"
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
  categoryName?: string; // NEW: for unique category coloring
}

const badgeStyles = {
  success:    "border-emerald-500/50 bg-emerald-800/20 text-emerald-200",
  warning:    "border-amber-400/50 bg-yellow-900/20 text-amber-200",
  info:       "border-blue-500/50 bg-blue-900/20 text-blue-200",
  danger:     "border-rose-500/50 bg-rose-800/20 text-rose-200",
  category:   "", // override below
  type:       "border-findom-green/60 bg-black/30 text-findom-green",
  featured:   "border-findom-purple/80 bg-findom-purple/10 text-findom-purple",
  vip:        "border-yellow-400/70 bg-yellow-950/30 text-yellow-400",
  default:    "border-white/10 bg-white/0 text-white/90",
};

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName, // e.g. Findoms, Catfish
}: AppBadgeProps) {
  // Use colored badge if variant=category and categoryName is provided
  const customClass =
    variant === "category" && categoryName && CATEGORY_COLORS[categoryName]
      ? CATEGORY_COLORS[categoryName]
      : badgeStyles[variant];

  // Only variant-based icons, no icon for categories unless specified
  const IconComponent =
    icon !== undefined
      ? icon
      : variant in ICONS
      ? ICONS[variant as keyof typeof ICONS]
      : null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-all",
        "shadow-sm ring-1 ring-inset ring-white/5",
        customClass,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {IconComponent && variant !== "category" && (
        <span className="mr-1 opacity-80">{IconComponent}</span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
