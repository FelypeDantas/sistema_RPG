import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold",
  "transition-all duration-200",
  "focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:ring-offset-2 focus:ring-offset-cyber-dark",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30",

        secondary:
          "border-transparent bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30",

        success:
          "border-transparent bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",

        warning:
          "border-transparent bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30",

        destructive:
          "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30",

        outline:
          "border-white/20 text-white hover:bg-white/5",
      },

      glow: {
        true: "shadow-md shadow-neon-purple/20",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      glow: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, glow, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, glow }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
