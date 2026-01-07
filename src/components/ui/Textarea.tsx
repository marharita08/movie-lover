import * as React from "react";

import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  isEmpty?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, label, placeholder, error, isEmpty, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="relative w-full">
        <textarea
          id={id}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border shadow-inner-bottom bg-background px-3 py-2 text-base md:text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 peer",
            error &&
              "border-error focus-visible:border-error hover:border-error",
            className,
          )}
          placeholder={placeholder || ""}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 text-foreground top-2 text-base transition-all duration-200 bg-background px-1 cursor-text",
              "peer-focus:left-5 peer-focus:top-[-0.6rem] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary",
              (value || !isEmpty || placeholder) &&
                "left-5 top-[-0.6rem] translate-y-0 text-xs md:text-xs font-medium text-foreground h-[11px]",
              error && "text-error peer-focus:text-error",
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
