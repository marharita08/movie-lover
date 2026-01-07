import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/utils/cn";

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
              "flex min-h-11 w-full text-base text-foreground items-center justify-between rounded-md border bg-background px-3 py-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 shadow-inner-bottom focus:outline-none peer group",
              "h-fit",
              error && "border-error hover:border-error",
            )}
          >
            <div className="flex flex-wrap gap-2">
              {values.length > 0
                ? values.map((value) => (
                    <div
                      key={value.key}
                      className="bg-primary/10 rounded-lg px-[6px] py-[1.5px] text-base text-foreground flex items-center"
                    >
                      {value.label}
                      <Button
                        variant="ghost"
                        className="w-[18px] h-[18px] ml-1"
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
                "h-4 w-4 text-foreground transition-transform ",
                open && "rotate-180 text-primary",
              )}
            />
          </button>
          {label && (
            <label
              className={cn(
                "absolute left-3 text-muted-foreground text-base md:text-base transition-all duration-200 bg-background px-1 cursor-pointer top-1/2 -translate-y-1/2",
                values.length > 0
                  ? "top-[-0.6rem] translate-y-0 text-xs md:text-xs font-medium text-foreground h-[11px]"
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
        className="z-50 mt-1 rounded-md border bg-background text-foreground shadow-md p-1 max-h-[158px] overflow-y-auto min-w-(--radix-popover-trigger-width)"
      >
        {options.map((option) => {
          const selected = values.find((v) => v.key === option.key);
          return (
            <div
              key={option.key}
              onClick={() => toggleValue(option)}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-foreground text-base",
                "hover:bg-muted/30",
                selected && "font-medium",
              )}
            >
              {option.label}
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
};

export default SelectWithTags;
