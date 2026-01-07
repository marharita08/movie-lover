import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/utils/cn";

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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex mb-2",
        weekday:
          "text-foreground rounded-md w-9 font-semibold text-[0.8rem] flex-1 text-center",
        week: "flex mb-2",
        day: "flex-1 text-center text-sm p-0 relative",
        day_button: "h-10 w-10 p-0 font-normal relative",
        selected: "bg-primary text-primary-foreground rounded-md",
        today: "bg-primary/10 text-primary font-semibold rounded-md",
        range_start:
          "bg-primary text-primary-foreground rounded-none rounded-l-md",
        range_end:
          "bg-primary text-primary-foreground rounded-none rounded-r-md",
        range_middle: "bg-primary/50 rounded-none",
        disabled: "opacity-50",
        outside: "opacity-30",
        ...classNames,
      }}
      navLayout="around"
      fixedWeeks
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
