
// Override: Make the shadcn/ui badge match the mockup/beauty style everywhere in the app.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// All badges look visually unified and harmonious.
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-4 py-1.5 min-h-[36px] text-white font-bold uppercase tracking-wide border border-white/10 shadow-[0_2px_12px_0_rgba(0,0,0,0.15)] bg-black/50 backdrop-blur-md text-base", {
    variants: {
      variant: {
        default:
          "",
        secondary:
          "",
        destructive:
          "",
        outline: "",
        category: "",
        featured: "",
        new: "",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
