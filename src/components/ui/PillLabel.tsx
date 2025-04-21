
import React from "react";
import { cn } from "@/lib/utils";
import { Check, X, Info, AlertTriangle } from "lucide-react";

type PillVariant = "success" | "pending" | "info" | "danger" | "vip" | "primary" | "category";

const iconMap = {
  success: Check,
  pending: AlertTriangle,
  info: Info,
  danger: X,
  vip: Check,
  primary: Info,
  category: Info
};
const colorMap: Record<PillVariant, string> = {
  success: "border-emerald-400 text-emerald-200 bg-emerald-900/30",
  pending: "border-amber-400 text-amber-200 bg-amber-900/30",
  info: "border-blue-400 text-blue-200 bg-blue-900/30",
  danger: "border-rose-400 text-rose-200 bg-rose-900/30",
  vip: "border-violet-500 text-violet-200 bg-violet-900/30",
  primary: "border-findom-purple text-findom-purple bg-findom-purple/10",
  category: "border-findom-green text-findom-green bg-findom-green/10"
};
const labelMap: Record<PillVariant, string> = {
  success: "Success",
  pending: "Pending",
  info: "Info",
  danger: "Failed",
  vip: "VIP",
  primary: "",
  category: ""
};

interface PillLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  bold?: boolean;
  small?: boolean;
}

const PillLabel = ({
  variant = "info",
  icon,
  children,
  className,
  bold,
  small = false,
  ...props
}: PillLabelProps) => {
  const Icon = icon || (iconMap[variant] && React.createElement(iconMap[variant], { className: `${small ? "w-4 h-4" : "w-5 h-5"} mr-1.5` }));
  return (
    <span
      className={cn(
        "inline-flex items-center px-3",
        small ? "py-0.5 text-xs" : "py-1 text-sm",
        "rounded-full border font-medium gap-1.5",
        "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]",
        colorMap[variant],
        bold && "font-bold",
        className
      )}
      {...props}
    >
      {Icon}
      {children}
    </span>
  );
};

export default PillLabel;
