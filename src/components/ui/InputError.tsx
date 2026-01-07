import { cn } from "@/utils/cn";
import { CircleXIcon } from "lucide-react";

interface InputErrorProps {
  error?: string;
  className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={cn("flex items-center gap-1 px-1", className)}>
      <CircleXIcon className="w-4 h-4 text-error" />
      <p className="text-xs text-error">{error}</p>
    </div>
  );
};

export default InputError;
