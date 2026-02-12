import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      [
        "peer h-5 w-5 shrink-0 rounded-md",
        "border border-white/20 bg-cyber-card",
        "transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-neon-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-dark",
        "data-[state=checked]:bg-neon-purple",
        "data-[state=checked]:border-neon-purple",
        "data-[state=checked]:text-white",
        "hover:border-neon-purple/60",
        "disabled:cursor-not-allowed disabled:opacity-40",
      ].join(" "),
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="flex items-center justify-center text-current"
    >
      <Check className="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
