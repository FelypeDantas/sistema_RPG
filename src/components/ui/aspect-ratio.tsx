import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-xl",
      "bg-cyber-card border border-white/10",
      "transition-all",
      className
    )}
    {...props}
  />
));

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
