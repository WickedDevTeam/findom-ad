
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Exact palette & style from mockup:
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full",
    "px-4 py-1.5",
    "min-h-[36px]",
    "font-medium",
    "text-base",
    "border-2",
    "gap-1.5",
    "bg-black/70",
    "transition-colors duration-150",
    "backdrop-blur",
    "select-none",
    "tracking-wide"
  ].join(" "),
  {
    variants: {
      variant: {
        success:
          "border-[#18d28f] text-[#18d28f] [&_svg]:text-[#18d28f]",
        pending:
          "border-[#ffc527] text-[#ffc527] [&_svg]:text-[#ffc527]",
        submitted:
          "border-[#5d64d9] text-[#A8B6FC] [&_svg]:text-[#A8B6FC]",
        failed: // custom failed status
          "border-[#A23B7C] text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        destructive: // alias to failed so old components still work
          "border-[#A23B7C] text-[#ffb3e1] [&_svg]:text-[#ffb3e1]",
        outline:
          "border-[#4b5563] text-white/80",
        default:
          "border-[#8B5CF6] text-[#E5DEFF]",
        category:
          "border-[#5d64d9] text-[#A8B6FC]",
        type:
          "border-[#9b87f5] text-[#E5DEFF]",
        featured:
          "border-[#D946EF] text-[#D946EF]",
        new:
          "border-[#18d28f] text-[#18d28f]",
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
        fontSize: 17,
        letterSpacing: "0.02em",
        borderWidth: 2,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
