
import React from "react";
import { X, Check, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

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
}

const badgeStyles = {
  success:    "border-emerald-500/50 bg-emerald-800/20 text-emerald-200",
  warning:    "border-amber-400/50 bg-yellow-900/20 text-amber-200",
  info:       "border-blue-500/50 bg-blue-900/20 text-blue-200",
  danger:     "border-rose-500/50 bg-rose-800/20 text-rose-200",
  category:   "border-findom-purple/60 bg-black/30 text-findom-purple-light",
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
}: AppBadgeProps) {
  const IconComponent = icon !== undefined 
    ? icon 
    : (variant in ICONS ? ICONS[variant as keyof typeof ICONS] : null);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all",
        "shadow-sm ring-1 ring-inset ring-white/5",
        badgeStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {IconComponent && (
        <span className="mr-1 opacity-80">{IconComponent}</span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AppBadge;
