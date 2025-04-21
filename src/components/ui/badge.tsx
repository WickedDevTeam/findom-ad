
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Refined badge styles from the mockup screenshot
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full",
    "px-3 py-1", // More compact size
    "min-h-[28px]", // Smaller height
    "font-medium",
    "text-sm", // Smaller text
    "border",
    "gap-1",
    "bg-black/80", // Darker background
    "transition-colors",
    "backdrop-blur-sm",
    "select-none"
  ].join(" "),
  {
    variants: {
      variant: {
        success:
          "border-[#18d28f]/80 text-[#18d28f] [&_svg]:text-[#18d28f]",
        pending:
          "border-[#ffc527]/80 text-[#ffc527] [&_svg]:text-[#ffc527]",
        submitted:
          "border-[#5d64d9]/80 text-[#A8B6FC] [&_svg]:text-[#A8B6FC]",
        failed:
          "border-[#A23B7C]/80 text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        destructive: // alias to failed
          "border-[#A23B7C]/80 text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        outline:
          "border-white/20 text-white/90",
        default:
          "border-[#8B5CF6]/80 text-[#E5DEFF]",
        category: // Match the CATFISH/FINDOM style from screenshot
          "border-white/20 text-white bg-black/80 uppercase text-xs tracking-wider font-semibold",
        type: // Match the BLACKMAIL style from screenshot
          "border-white/20 text-white bg-black/80 uppercase text-xs tracking-wider font-semibold",
        featured:
          "border-[#D946EF]/80 text-[#D946EF]",
        new:
          "border-[#18d28f]/80 text-[#18d28f]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
      style={{
        fontWeight: 500,
        fontSize: 14, // Smaller font size
        letterSpacing: "0.02em",
        borderWidth: 1, // Thinner border
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
