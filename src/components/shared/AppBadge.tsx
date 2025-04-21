
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

/**
 * Subtle, pastel-style category badge colors, inspired by the user-provided mockup.
 */
const CATEGORY_COLORS: Record<string, string> = {
  Findoms:    "border-[#B49DF9] text-[#B49DF9] bg-transparent",       // Soft purple outline, text
  Catfish:    "border-[#6FD3F7] text-[#6FD3F7] bg-transparent",       // Pastel blue
  "AI Bots":  "border-[#7CDEB0] text-[#7CDEB0] bg-transparent",       // Soft teal/green
  "Pay Pigs": "border-[#F6C288] text-[#F6C288] bg-transparent",       // Soft orange/beige
  Celebrities: "border-[#F7ADC0] text-[#F7ADC0] bg-transparent",      // Soft pink
  Blackmail:  "border-[#EAADBC] text-[#EAADBC] bg-transparent",       // Gentle red/pink
  Twitter:    "border-[#99B7EE] text-[#99B7EE] bg-transparent",       // Muted blue
  Bots:       "border-[#B6A3E4] text-[#B6A3E4] bg-transparent",       // Soft violet
  Other:      "border-white/40 text-white/80 bg-transparent"
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
  // Mimic your image: transparent bg, pastel border/text, slightly larger radius
  success: "border-[#6EC4A1] text-[#6EC4A1] bg-transparent",    // Soft green
  warning: "border-[#E2C182] text-[#E2C182] bg-transparent",    // Soft yellow/gold
  info:    "border-[#91B4D5] text-[#91B4D5] bg-transparent",    // Soft blue
  danger:  "border-[#E39AA1] text-[#E39AA1] bg-transparent",    // Soft red/pink
  category: "", // Override below with CATEGORY_COLORS
  type: "border-[#9b87f5]/70 text-[#9b87f5] bg-transparent",    // Brand-matched soft purple
  featured: "border-[#B49DF9] text-[#B49DF9] bg-transparent",   // Soft purple
  vip: "border-[#F5DF89] text-[#F5DF89] bg-transparent",        // Mellow yellow/gold
  default: "border-white/20 text-white/80 bg-transparent",
};

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  // Use colored badge if variant=category and categoryName is provided
  const customClass =
    variant === "category" && categoryName && CATEGORY_COLORS[categoryName]
      ? CATEGORY_COLORS[categoryName]
      : badgeStyles[variant];

  // Only variant-based icons (danger, warning, etc). No emoji nor icon for categories.
  const IconComponent =
    icon !== undefined
      ? icon
      : variant !== "category" && variant in ICONS
      ? ICONS[variant as keyof typeof ICONS]
      : null;

  return (
    <span
      className={clsx(
        // Universal badge look: pill, subtle border, cleaner layout, match your mockup closely
        "inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1 text-sm font-semibold transition-all",
        "shadow-none ring-0",
        customClass,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{ lineHeight: "1.2", minHeight: 32, minWidth: 0 }} // Balanced vertical sizing
    >
      {IconComponent && (
        <span className="opacity-80 flex items-center">{IconComponent}</span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
