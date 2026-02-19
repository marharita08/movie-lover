import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const loadingVariants = cva(
  "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-primary-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

const loadingOverlayVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center",
  {
    variants: {
      background: {
        default: "bg-background/80 backdrop-blur-sm",
        transparent: "bg-transparent",
        solid: "bg-background",
      },
    },
    defaultVariants: {
      background: "default",
    },
  },
);

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
  "aria-label"?: string;
}

export interface LoadingOverlayProps extends VariantProps<
  typeof loadingOverlayVariants
> {
  size?: LoadingProps["size"];
  variant?: LoadingProps["variant"];
  className?: string;
  "aria-label"?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, variant, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(loadingVariants({ size, variant }), className)}
        role="status"
        aria-label={ariaLabel || "Loading"}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      className,
      background,
      size = "xl",
      variant = "default",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(loadingOverlayVariants({ background }), className)}
        role="dialog"
        aria-label={ariaLabel || "Loading"}
        {...props}
      >
        <Loading size={size} variant={variant} />
      </div>
    );
  },
);

const CreateListLoading = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      className,
      background,
      size = "xl",
      variant = "default",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(loadingOverlayVariants({ background }), className)}
        role="dialog"
        aria-label={ariaLabel || "Loading"}
        {...props}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Loading size={size} variant={variant} />
          <p>Processing your list data...</p>
          <p className="text-muted-foreground">
            This may take a few seconds...
          </p>
        </div>
      </div>
    );
  },
);

Loading.displayName = "Loading";
LoadingOverlay.displayName = "LoadingOverlay";
CreateListLoading.displayName = "CreateListLoading";

export { CreateListLoading, Loading, LoadingOverlay };
