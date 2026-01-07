import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  label?: string;
  value?: string;
  error?: boolean;
  startIcon?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, label, value, error, startIcon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex gap-2 h-11 w-full text-base text-foreground items-center justify-between rounded-md border bg-background px-3 py-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 data-[state=open]:border-primary shadow-inner-bottom focus:outline-none peer group",
          error &&
            "border-error data-[state=open]:border-error hover:border-error",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {startIcon && (
            <div className="left-3 flex items-center cursor-pointer text-muted-foreground group-data-[state=open]:text-primary shrink-0 w-[18px] h-[18px]">
              {startIcon}
            </div>
          )}
          {children || <SelectValue placeholder=" " />}
        </div>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-foreground transition-transform group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary shrink-0",
              error && "text-error group-data-[state=open]:text-error",
            )}
          />
        </SelectPrimitive.Icon>
        {label && (
          <label
            className={cn(
              "absolute left-3 text-muted-foreground text-base transition-all duration-200 bg-background px-1 cursor-pointer top-1/2 -translate-y-1/2 group-data-[state=open]:text-primary",
              startIcon && "left-9",
              value &&
                "top-[-0.6rem] translate-y-0 text-xs font-medium text-foreground peer-data-[state=open]:text-primary left-5 h-[11px]",
              error && "text-error group-data-[state=open]:text-error",
            )}
          >
            {label}
          </label>
        )}
      </SelectPrimitive.Trigger>
    </div>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

interface SelectContentProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> {
  viewportClassName?: string;
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    { className, children, position = "popper", viewportClassName, ...props },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 min-w-32 rounded-md border bg-background text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1 h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) max-w-(--radix-select-trigger-width)",
            viewportClassName,
          )}
        >
          <div className="max-h-[158px] overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-base text-foreground outline-none data-highlighted:bg-primary/5 data-disabled:pointer-events-none data-disabled:opacity-50 focus:bg-primary/5",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText asChild>
      <span className="block truncate flex-1 min-w-0">{children}</span>
    </SelectPrimitive.ItemText>

    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center shrink-0">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
