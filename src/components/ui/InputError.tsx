import { CircleXIcon } from "lucide-react";

import { TranslationKey } from "@/const";
import { useTranslation } from "@/hooks";
import { cn } from "@/utils";

interface InputErrorProps {
  error?: string;
  className?: string;
}

export const InputError: React.FC<InputErrorProps> = ({ error, className }) => {
  const { t } = useTranslation();
  if (!error) return null;

  const translatedError =
    error in TranslationKey ? t(error as TranslationKey) : error;

  return (
    <div className={cn("flex items-center gap-1 px-1", className)}>
      <CircleXIcon className="text-error h-4 w-4" />
      <p className="text-error text-xs">{translatedError}</p>
    </div>
  );
};
