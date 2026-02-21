import { CircleXIcon } from "lucide-react";

import { cn } from "@/utils";

interface InputErrorProps {
  error?: string;
  className?: string;
}

export const InputError: React.FC<InputErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={cn("flex items-center gap-1 px-1", className)}>
      <CircleXIcon className="text-error h-4 w-4" />
      <p className="text-error text-xs">{error}</p>
    </div>
  );
};
