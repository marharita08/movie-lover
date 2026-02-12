import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

import { Label } from "./Label";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  label?: string;
  error?: boolean;
  startIcon?: React.ReactNode;
  placeholder?: string;
}

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ id, className, label, error, startIcon, placeholder, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "data-placeholder:text-muted-foreground text-foreground bg-background placeholder:text-muted-foreground data-[state=open]:border-primary peer group flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-neutral-500 px-3 py-2 text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          error &&
            "border-error data-[state=open]:border-error hover:border-error",
          className,
        )}
        id={id}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {startIcon && (
            <div className="group-data-[state=open]:text-primary left-3 flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center text-neutral-600">
              {startIcon}
            </div>
          )}
          <SelectValue placeholder={placeholder} />
        </div>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className={cn(
              "group-data-[state=open]:text-primary h-4 w-4 shrink-0 text-neutral-600 transition-transform group-data-[state=open]:rotate-180",
              error && "text-error group-data-[state=open]:text-error",
            )}
          />
        </SelectPrimitive.Icon>
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
  React.ComponentRef<typeof SelectPrimitive.Content>,
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
          "bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-32 rounded-md border border-neutral-500 shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "h-(--radix-select-trigger-height) w-full max-w-(--radix-select-trigger-width) min-w-(--radix-select-trigger-width) p-1",
            viewportClassName,
          )}
        >
          <div className="max-h-[158px] overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pr-2 pl-8 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "text-foreground data-highlighted:bg-secondary-100 focus:bg-secondary-100 relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-base outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText asChild>
      <span className="block min-w-0 flex-1 truncate">{children}</span>
    </SelectPrimitive.ItemText>

    <span className="absolute right-2 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="text-primary h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("bg-muted -mx-1 my-1 h-px", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
