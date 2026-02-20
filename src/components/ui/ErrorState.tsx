import { AlertCircle, RefreshCw, ServerCrash, Wifi } from "lucide-react";

import { HttpException } from "@/types";

import { Button } from "./Button";

interface ErrorStateProps {
  title: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  type?: "network" | "server" | "generic";
}

const icons = {
  network: Wifi,
  server: ServerCrash,
  generic: AlertCircle,
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  error,
  onRetry,
  type = "generic",
}) => {
  const IconComponent = icons[type] || AlertCircle;
  const descriptionText =
    (error instanceof HttpException && error.body?.message) ||
    description ||
    "Please try again later";

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
      <div className="bg-error/10 rounded-full p-6">
        <IconComponent className="text-error h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{descriptionText}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
