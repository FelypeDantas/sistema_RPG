import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg text-sm font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-dark",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-neon-purple text-white hover:bg-neon-purple/90 shadow-md shadow-neon-purple/20",

        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 shadow-md shadow-red-500/20",

        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/5",

        secondary:
          "bg-neon-cyan text-cyber-dark hover:bg-neon-cyan/90 shadow-md shadow-neon-cyan/20",

        ghost:
          "text-white hover:bg-white/5",

        link:
          "text-neon-cyan underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },

      glow: {
        true: "hover:scale-105",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, glow }),
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
