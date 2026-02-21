import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils";

import { Button } from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

interface SelectWithTagsProps {
  options: { label: string; key: string }[];
  values: { label: string; key: string }[];
  onChange: (values: { label: string; key: string }[]) => void;
  label?: string;
  error?: boolean;
}

const SelectWithTags = ({
  options,
  values,
  onChange,
  label,
  error,
}: SelectWithTagsProps) => {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (value: { label: string; key: string }) => {
    onChange(
      values.find((v) => v.key === value.key)
        ? values.filter((v) => v.key !== value.key)
        : [...values, value],
    );
  };

  const handleRemove = (
    value: { label: string; key: string },
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(values.filter((v) => v.key !== value.key));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <button
            type="button"
            className={cn(
              "text-foreground bg-background placeholder:text-muted-foreground shadow-inner-bottom peer group flex min-h-11 w-full items-center justify-between rounded-xl border border-neutral-500 px-3 py-2 text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              "h-fit",
              error && "border-error hover:border-error",
            )}
          >
            <div className="flex flex-wrap gap-2">
              {values.length > 0
                ? values.map((value) => (
                    <div
                      key={value.key}
                      className="bg-primary-100 text-foreground flex items-center rounded-lg px-[6px] py-[1.5px] text-base"
                    >
                      {value.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-[18px] w-[18px]"
                        onClick={(e) => handleRemove(value, e)}
                      >
                        <X className="h-[14px] w-[14px]" />
                      </Button>
                    </div>
                  ))
                : null}
            </div>
            <ChevronDown
              className={cn(
                "text-foreground h-4 w-4 transition-transform",
                open && "text-primary rotate-180",
              )}
            />
          </button>
          {label && (
            <label
              className={cn(
                "text-muted-foreground bg-background absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer px-1 text-base transition-all duration-200 md:text-base",
                values.length > 0
                  ? "text-foreground top-[-0.6rem] h-[11px] translate-y-0 text-xs font-medium md:text-xs"
                  : "",
                error && "text-error",
              )}
            >
              {label}
            </label>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="bg-background text-foreground z-50 mt-1 max-h-[158px] min-w-(--radix-popover-trigger-width) overflow-y-auto rounded-md border p-1 shadow-md"
      >
        {options.map((option) => {
          const selected = values.find((v) => v.key === option.key);
          return (
            <div
              key={option.key}
              onClick={() => toggleValue(option)}
              className={cn(
                "text-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-base select-none",
                "hover:bg-muted/30",
                selected && "font-medium",
              )}
            >
              {option.label}
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
  );
};

export default SelectWithTags;
