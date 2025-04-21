
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Refined badge styles from the mockup screenshot with vibrant colors
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full",
    "px-3 py-1", // Compact size
    "min-h-[28px]", // Appropriate height
    "font-medium",
    "text-sm", // Smaller text
    "border",
    "gap-1",
    "transition-colors",
    "backdrop-blur-sm",
    "select-none"
  ].join(" "),
  {
    variants: {
      variant: {
        success:
          "border-[#18d28f]/80 bg-[#18d28f]/10 text-[#18d28f] [&_svg]:text-[#18d28f]",
        pending:
          "border-[#ffc527]/80 bg-[#ffc527]/10 text-[#ffc527] [&_svg]:text-[#ffc527]",
        submitted:
          "border-[#5d64d9]/80 bg-[#5d64d9]/10 text-[#A8B6FC] [&_svg]:text-[#A8B6FC]",
        failed:
          "border-[#A23B7C]/80 bg-[#A23B7C]/10 text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        destructive: // alias to failed
          "border-[#A23B7C]/80 bg-[#A23B7C]/10 text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        outline:
          "border-white/20 bg-black/60 text-white/90",
        default:
          "border-[#8B5CF6]/80 bg-[#8B5CF6]/10 text-[#E5DEFF]",
        category: // Match the CATFISH/FINDOM style from screenshot
          "border-[#F97316]/80 bg-[#F97316]/10 text-[#FDE1D3] uppercase text-xs tracking-wider font-semibold",
        type: // Match the BLACKMAIL style from screenshot
          "border-[#0EA5E9]/80 bg-[#0EA5E9]/10 text-[#D3E4FD] uppercase text-xs tracking-wider font-semibold",
        featured:
          "border-[#D946EF]/80 bg-[#D946EF]/10 text-[#D946EF]",
        new:
          "border-[#18d28f]/80 bg-[#18d28f]/10 text-[#18d28f]",
        // Add more vibrant badge types as shown in the mockup
        findom:
          "border-[#9b87f5]/80 bg-[#9b87f5]/10 text-[#E5DEFF]",
        catfish:
          "border-[#F97316]/80 bg-[#F97316]/10 text-[#FDE1D3]",
        aibot:
          "border-[#0EA5E9]/80 bg-[#0EA5E9]/10 text-[#D3E4FD]",
        celebrity:
          "border-[#D946EF]/80 bg-[#D946EF]/10 text-[#FFDEE2]",
        twitter:
          "border-[#1DA1F2]/80 bg-[#1DA1F2]/10 text-[#D3E4FD]",
        blackmail:
          "border-[#EA384C]/80 bg-[#EA384C]/10 text-[#FFDEE2]",
        paypig:
          "border-[#F97316]/80 bg-[#F97316]/10 text-[#FDE1D3]",
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
        fontSize: 14,
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
