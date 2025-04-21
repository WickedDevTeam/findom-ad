
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

// Pastel backgrounds and readable text for categories
const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; shadow: string }
> = {
  Findoms: { bg: "bg-[#E5DEFF]", text: "text-[#3D2676]", shadow: "shadow-[#c2b4eb]/40" },
  Catfish: { bg: "bg-[#D3E4FD]", text: "text-[#134077]", shadow: "shadow-[#b2d1f4]/40" },
  "AI Bots": { bg: "bg-[#F2FCE2]", text: "text-[#3D5A26]", shadow: "shadow-[#dbeac1]/40" },
  "Pay Pigs": { bg: "bg-[#FEF7CD]", text: "text-[#916519]", shadow: "shadow-[#ffe8a2]/40" },
  Celebrities: { bg: "bg-[#FFDEE2]", text: "text-[#AD2C63]", shadow: "shadow-[#f6bcd1]/40" },
  Blackmail: { bg: "bg-[#FDE1D3]", text: "text-[#955138]", shadow: "shadow-[#f1bca2]/40" },
  Twitter: { bg: "bg-[#F1F0FB]", text: "text-[#343B93]", shadow: "shadow-[#b8b6db]/40" },
  Bots: { bg: "bg-[#E5DEFF]", text: "text-[#5646A5]", shadow: "shadow-[#c2b4eb]/40" },
  Other: { bg: "bg-white/80", text: "text-findom-dark", shadow: "shadow-gray-200" }
};

// For "type" badge (eg "Human", "AI")
// Pick a unique glassy look that's still appealing - purple glass for now
const TYPE_STYLE = {
  bg: "bg-[#EBE5F9]/90", // Soft pastel purple glassy
  text: "text-[#6340A5]",
  shadow: "shadow-[#d5c5ee]/40"
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

const BADGE_BASE =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 min-h-[30px] min-w-0 text-xs font-semibold transition-all duration-150 shadow-md";

const VARIANT_STYLES: Record<AppBadgeVariant, string> = {
  success: "bg-green-100 text-green-800 shadow-green-200",
  warning: "bg-yellow-100 text-yellow-800 shadow-yellow-200",
  info: "bg-blue-100 text-blue-800 shadow-blue-200",
  danger: "bg-red-100 text-red-800 shadow-red-200",
  featured:
    "bg-gradient-to-r from-[#B49DF9]/90 to-[#A085F9]/70 text-[#57419E] shadow-[#cabffc]/60",
  vip: "bg-gradient-to-r from-[#FEDE89]/90 to-[#F7C873]/80 text-[#B19646] shadow-[#f9e5b8]/70",
  category: "", // Overwritten below
  type: "", // Overwritten below
  default: "bg-black/20 text-white/80 shadow-gray-900/10",
};

export function AppBadge({
  children,
  variant = "default",
  icon,
  className,
  onClick,
  categoryName,
}: AppBadgeProps) {
  let styleClass = VARIANT_STYLES[variant];
  let dropShadow = "";

  // Category & type get soft pastel styles
  if (variant === "category") {
    const style =
      (categoryName && CATEGORY_STYLES[categoryName]) || CATEGORY_STYLES.Other;
    styleClass = `${style.bg} ${style.text}`;
    dropShadow = style.shadow;
  } else if (variant === "type") {
    styleClass = `${TYPE_STYLE.bg} ${TYPE_STYLE.text}`;
    dropShadow = TYPE_STYLE.shadow;
  }

  // Only show an icon for supported non-category badges
  const IconComponent =
    icon !== undefined
      ? icon
      : !["category", "type"].includes(variant) && variant in ICONS
      ? ICONS[variant as keyof typeof ICONS]
      : null;

  return (
    <span
      className={clsx(
        BADGE_BASE,
        styleClass,
        dropShadow && `shadow-md ${dropShadow}`,
        "backdrop-blur-[2px]",
        "font-semibold text-sm",
        "select-none",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{
        lineHeight: "1.22",
        letterSpacing: ".01em",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent"
      }}
    >
      {/* No icons for category/type */}
      {!["category", "type"].includes(variant) && IconComponent && (
        <span className="opacity-80 flex items-center">{IconComponent}</span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
