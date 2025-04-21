
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const categoryColorByName: Record<string, string> = {
  Findom: "bg-[#9b87f5]/30 text-[#9b87f5] border-[#9b87f5]/60",
  "Pay Pigs": "bg-[#50C878]/20 text-[#50C878] border-[#50C878]/60",
  Catfish: "bg-[#1EAEDB]/20 text-[#1EAEDB] border-[#1EAEDB]/60",
  "AI Bots": "bg-[#FFA99F]/30 text-[#FFA99F] border-[#FFA99F]/60",
  Celebrities: "bg-[#F97316]/20 text-[#F97316] border-[#F97316]/60",
  Twitter: "bg-[#6E59A5]/20 text-[#6E59A5] border-[#6E59A5]/60",
  Blackmail: "bg-[#ea384c]/20 text-[#ea384c] border-[#ea384c]/60",
  Bots: "bg-[#33C3F0]/10 text-[#33C3F0] border-[#33C3F0]/60",
};

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-white/30",
        // Add extra category style; will be combined in code for per-category
        category: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  categoryName?: string; // For category-specific styles
}

function Badge({ className, variant, categoryName, ...props }: BadgeProps) {
  let categoryExtra = "";
  if (variant === "category" && categoryName && categoryColorByName[categoryName]) {
    categoryExtra = categoryColorByName[categoryName];
  }
  return (
    <div
      className={cn(badgeVariants({ variant }), categoryExtra, className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
