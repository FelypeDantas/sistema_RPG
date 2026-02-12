import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Variantes para linhas da tabela
const tableRowVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "data-[state=selected]:bg-muted hover:bg-muted/50",
      striped: "even:bg-muted/5 odd:bg-muted/0 hover:bg-muted/50",
    },
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Variantes para células da tabela
const tableCellVariants = cva("align-middle px-4", {
  variants: {
    size: {
      sm: "py-1 text-sm",
      md: "py-2 text-base",
      lg: "py-3 text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Table wrapper
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-md shadow-sm">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

// Header
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

// Body
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

// Footer
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  )
);
TableFooter.displayName = "TableFooter";

// Row
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement>, VariantProps<typeof tableRowVariants> {}
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, size, ...props }, ref) => (
    <tr ref={ref} className={cn(tableRowVariants({ variant, size }), className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

// Head cell
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableCellVariants> {}
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, scope = "col", size, ...props }, ref) => (
    <th
      ref={ref}
      scope={scope}
      className={cn(tableCellVariants({ size }), "font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

// Data cell
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableCellVariants> {}
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, size, ...props }, ref) => <td ref={ref} className={cn(tableCellVariants({ size }), className)} {...props} />
);
TableCell.displayName = "TableCell";

// Caption
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
