import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { Label } from "./Label";

const inputVariants = cva(
  "text-foreground shadow-md flex w-full peer rounded-xl bg-background px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default: "border border-neutral-500 focus-visible:border-primary",
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

    const labelElement = label ? <Label htmlFor={id}>{label}</Label> : null;

    const inputElement = (
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
        placeholder={placeholder}
        aria-invalid={error}
      />
    );

    if (startIcon || showClearIcon) {
      return (
        <div className="flex flex-col gap-1">
          {labelElement}
          <div
            className={cn(
              "relative flex items-center focus-within:text-primary text-neutral-600 w-full",
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
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {labelElement}
        {inputElement}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
