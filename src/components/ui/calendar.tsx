import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-xl border border-white/10 bg-cyber-card",
        className
      )}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
        month: "space-y-4",
        caption:
          "flex justify-center pt-1 relative items-center text-white",
        caption_label: "text-sm font-semibold tracking-wide",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 bg-transparent hover:bg-white/5"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-9 font-normal text-[0.75rem]",
        row: "flex w-full mt-2",
        cell:
          "relative h-9 w-9 text-center text-sm p-0 focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-gray-300 hover:bg-white/5 hover:text-white"
        ),
        day_selected:
          "bg-neon-purple text-white hover:bg-neon-purple/90 focus:bg-neon-purple shadow-md shadow-neon-purple/20",
        day_today:
          "border border-neon-cyan text-neon-cyan",
        day_outside:
          "text-gray-600 opacity-40 aria-selected:bg-white/5 aria-selected:text-gray-500",
        day_disabled: "text-gray-600 opacity-30",
        day_range_middle:
          "aria-selected:bg-neon-purple/20 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <ChevronLeft className="h-4 w-4 text-gray-400" />
        ),
        IconRight: () => (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
