import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";

const inputVariants = cva(
  "text-foreground flex w-full shadow-inner-bottom peer rounded-md bg-background px-3 py-2 text-base md:text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default: "border focus-visible:border-primary",
        success: "border border-success",
        error: "border border-error",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-11 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  startIcon?: React.ReactNode;
  onClear?: () => void;
  label?: string;
  labelClassName?: string;
  isEmpty?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size,
      error,
      startIcon,
      onClear,
      value,
      disabled,
      readOnly,
      placeholder,
      label,
      labelClassName,
      isEmpty = true,
      ...props
    },
    ref,
  ) => {
    const actualVariant = error ? "error" : variant || "default";
    const showClearIcon = onClear && value && !disabled && !readOnly;

    const id = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleClick = (
      e: React.MouseEvent<HTMLDivElement | HTMLLabelElement>,
    ) => {
      if (props.onClick) {
        const syntheticEvent = {
          ...e,
          currentTarget: inputRef.current,
          target: inputRef.current,
        } as React.MouseEvent<HTMLInputElement>;
        props.onClick(syntheticEvent);
      }

      if (inputRef.current && !disabled && !readOnly) {
        inputRef.current.focus();
      }
    };

    const inputElement = (
      <div className="relative w-full">
        <input
          {...props}
          id={id}
          type={type}
          className={cn(
            inputVariants({ variant: actualVariant, size }),
            startIcon && "pl-10",
            showClearIcon && "pr-9",
            className,
          )}
          ref={inputRef}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder || " "}
          aria-invalid={error}
        />

        {label && (
          <label
            htmlFor={id}
            onClick={handleClick}
            className={cn(
              "absolute left-3 text-muted-foreground text-base md:text-base transition-all duration-200 bg-background px-1 cursor-text",
              !placeholder &&
                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
              startIcon && "peer-placeholder-shown:left-9 ",
              "peer-focus:left-5 peer-focus:top-[-0.6rem] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary",
              (value || !isEmpty || placeholder) &&
                "top-[-0.6rem] translate-y-0 text-xs md:text-xs font-medium text-foreground left-5 h-[11px]",
              labelClassName,
              actualVariant === "error" && "text-error peer-focus:text-error",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
          </label>
        )}
      </div>
    );

    if (startIcon || showClearIcon) {
      return (
        <div
          className={cn(
            "relative flex items-center focus-within:text-primary text-foreground w-full",
            actualVariant === "error" && "text-error focus-within:text-error",
          )}
        >
          {startIcon && (
            <div
              onClick={handleClick}
              className={cn(
                "absolute left-3 z-10 flex items-center cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {startIcon}
            </div>
          )}
          {inputElement}
          {showClearIcon && (
            <div className="absolute right-3 z-10 flex items-center gap-1">
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear input"
                className="flex h-5 w-5 items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }

    return inputElement;
  },
);

Input.displayName = "Input";

export { Input };
