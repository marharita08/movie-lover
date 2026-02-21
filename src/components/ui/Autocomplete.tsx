import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Label } from "./Label";

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
    <div>
      {fieldLabel && <Label>{fieldLabel}</Label>}
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
          <div className="relative">
            <div
              className={cn(
                "text-foreground bg-background placeholder:text-muted-foreground shadow-inner-bottom peer group flex min-h-11 w-full items-center justify-between rounded-xl border border-neutral-500 px-3 py-2 text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
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
                    "h-[18px] w-[18px] text-neutral-600",
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
                  "h-full w-full bg-transparent pr-3 outline-none focus:ring-0 focus:outline-none",
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
                  "h-4 w-4 shrink-0 text-neutral-600 transition-transform",
                  open && "text-primary rotate-180",
                  error && "text-error",
                  disabled && "opacity-50",
                )}
              />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "bg-background text-foreground z-50 mt-1 max-h-[158px] max-w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) overflow-y-auto rounded-md border p-1 shadow-md",
            contentClassName,
          )}
          align={align}
        >
          {filteredItems.length === 0 && (
            <div className="text-muted-foreground px-3 py-2 text-sm">
              No results
            </div>
          )}

          {filteredItems.map((item) => {
            const selected = itemKey(item) === value;
            return (
              <div
                className={cn(
                  "text-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-base select-none",
                  "hover:bg-secondary-100",
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
                    <Check className="text-primary h-4 w-4" />
                  </span>
                )}
              </div>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
