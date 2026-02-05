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
import { InfoIcon, AlertTriangleIcon, XIcon, CheckIcon } from "lucide-react";

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
            <div className="w-full flex items-stretch justify-between gap-2 overflow-hidden py-1 px-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    className,
                  )}
                >
                  <Icon className="w-4 h-4" />
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
