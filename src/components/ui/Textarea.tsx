import * as React from "react";

import { cn } from "@/utils/cn";
import { Label } from "./Label";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, placeholder, error, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="w-full">
        {label && <Label htmlFor={id}>{label}</Label>}
        <textarea
          id={id}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border border-neutral-500 bg-background px-3 py-2 text-base md:text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 peer",
            error &&
              "border-error focus-visible:border-error hover:border-error",
            className,
          )}
          placeholder={placeholder || ""}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
