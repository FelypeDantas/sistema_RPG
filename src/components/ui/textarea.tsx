import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-[40px] text-sm",
        md: "min-h-[80px] text-sm",
        lg: "min-h-[120px] text-base",
      },
      state: {
        default: "border-input",
        error: "border-destructive text-destructive placeholder:text-destructive/70 focus-visible:ring-destructive",
        success: "border-success text-success placeholder:text-success/70 focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, ...props }, ref) => {
    return <textarea ref={ref} className={cn(textareaVariants({ size, state }), className)} {...props} />;
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
