import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

type AutocompleteProps<T> = {
  items: T[];
  textValue?: string;
  value?: string;
  onChange: (val: string) => void;
  itemKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  filterFn: (item: T, search: string) => boolean;
  sortFn?: (a: T, b: T) => number;
  className?: string;
  contentClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  error?: boolean;
  fieldLabel?: string;
  startIcon?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  disabled?: boolean;
};

export function Autocomplete<T>({
  items,
  textValue,
  value,
  onChange,
  itemKey,
  renderItem,
  filterFn,
  sortFn,
  className,
  contentClassName,
  inputClassName,
  inputWrapperClassName,
  error,
  fieldLabel,
  startIcon,
  onOpenChange,
  align = "center",
  disabled,
}: AutocompleteProps<T>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearch(textValue || value || "");
  }, [textValue, value]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSearch(textValue || value || "");
    }
  };

  const filteredItems = items.filter((item) => filterFn(item, search));

  if (sortFn) {
    filteredItems.sort((a, b) => sortFn(a, b));
  }

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn("py-0", className)}
        onClick={(e) => {
          e.preventDefault();
          if (disabled) return;
          if (!open) {
            inputRef.current?.focus();
          }
          handleOpenChange(!open);
        }}
        asChild
      >
        <div className="relative w-full">
          <div
            className={cn(
              "flex min-h-11 w-full text-base md:text-base text-foreground items-center justify-between rounded-md border bg-background px-3 py-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 shadow-inner-bottom focus:outline-none peer group",
              "h-fit",
              open && "border-primary hover:border-primary",
              error && "border-error hover:border-error",
              disabled && "cursor-not-allowed opacity-50",
              inputWrapperClassName,
            )}
          >
            {startIcon && (
              <div
                className={cn(
                  "text-muted-foreground w-[18px] h-[18px]",
                  open && "text-primary",
                  error && "text-error",
                )}
              >
                {startIcon}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (!value) {
                  onChange("");
                }
              }}
              className={cn(
                "w-full h-full pr-3 bg-transparent outline-none focus:outline-none focus:ring-0",
                startIcon && "pl-2",
                disabled && "cursor-not-allowed",
                inputClassName,
              )}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleOpenChange(true);
              }}
              onFocus={() => {
                handleOpenChange(true);
              }}
            />
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-foreground transition-transform ",
                open && "rotate-180 text-primary",
                error && "text-error",
                disabled && "opacity-50",
              )}
            />
          </div>
          {fieldLabel && (
            <label
              className={cn(
                "absolute left-3 text-muted-foreground text-base md:text-base transition-all duration-200 bg-background px-1 cursor-pointer top-1/2 -translate-y-1/2",
                startIcon && "left-9",
                (open || search) &&
                  "top-[-0.6rem] translate-y-0 text-xs md:text-xs font-medium text-foreground left-5 h-[11px]",
                open && "text-primary",
                error && "text-error",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {fieldLabel}
            </label>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "z-50 mt-1 rounded-md border bg-background text-foreground shadow-md p-1 max-h-[158px] overflow-y-auto min-w-(--radix-popover-trigger-width) max-w-(--radix-popover-trigger-width)",
          contentClassName,
        )}
        align={align}
      >
        {filteredItems.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No results
          </div>
        )}

        {filteredItems.map((item) => {
          const selected = itemKey(item) === value;
          return (
            <div
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-foreground text-base",
                "hover:bg-muted/30",
                selected && "font-medium",
              )}
              key={itemKey(item)}
              onClick={() => {
                onChange(itemKey(item));
                handleOpenChange(false);
              }}
            >
              {renderItem(item)}
              {selected && (
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </span>
              )}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
