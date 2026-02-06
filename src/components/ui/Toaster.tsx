import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from "lucide-react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

const varianToDetails = {
  default: {
    icon: InfoIcon,
    className: "bg-primary text-primary-foreground",
  },
  warning: {
    icon: AlertTriangleIcon,
    className: "bg-warning text-warning-foreground",
  },
  destructive: {
    icon: XIcon,
    className: "bg-error text-error-foreground",
  },
  success: {
    icon: CheckIcon,
    className: "bg-success text-success-foreground",
  },
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const { icon: Icon, className } = varianToDetails[variant || "default"];

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex w-full items-stretch justify-between gap-2 overflow-hidden px-2 py-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    className,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
              </div>
              {action || <ToastClose />}
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
