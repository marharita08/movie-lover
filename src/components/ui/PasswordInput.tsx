import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/utils";

import { Input, type InputProps } from "./Input";
import { Label } from "./Label";

type PasswordInputProps = Omit<InputProps, "type" | "startIcon"> & {
  labelClassName?: string;
};

export const PasswordInput = ({
  error,
  label,
  labelClassName,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-1">
      <Label className={labelClassName}>{label || "Password"}</Label>
      <div className="relative">
        <Input
          {...props}
          error={error}
          type={showPassword ? "text" : "password"}
          startIcon={<LockIcon className="h-4 w-4" />}
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleShowPassword}
          className="hover:bg-accent absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer rounded-full p-1 transition-colors"
        >
          {showPassword ? (
            <EyeOff
              className={cn("text-primary h-4 w-4", error && "text-error")}
            />
          ) : (
            <Eye
              className={cn("text-primary h-4 w-4", error && "text-error")}
            />
          )}
        </button>
      </div>
    </div>
  );
};
