import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 backdrop-blur-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-cyber-card border-white/10 text-white [&>svg]:text-neon-cyan",

        destructive:
          "border-red-500/40 bg-red-500/10 text-red-400 shadow-md shadow-red-500/10 [&>svg]:text-red-400",

        success:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10 [&>svg]:text-emerald-400",

        warning:
          "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 shadow-md shadow-yellow-500/10 [&>svg]:text-yellow-400",

        info:
          "border-neon-purple/40 bg-neon-purple/10 text-neon-purple shadow-md shadow-neon-purple/10 [&>svg]:text-neon-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
