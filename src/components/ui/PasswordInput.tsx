import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/utils/cn.ts";

import { Input, type InputProps } from "./Input";
import { Label } from "./Label";

type PasswordInputProps = Omit<InputProps, "type" | "startIcon" | "label">;

const PasswordInput = ({ error, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    },
    [],
  );

  return (
    <div>
      <Label>Password</Label>
      <div className="relative">
        <Input
          {...props}
          error={error}
          type={showPassword ? "text" : "password"}
          startIcon={<LockIcon className="w-4 h-4" />}
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleShowPassword}
          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
        >
          {showPassword ? (
            <EyeOff
              className={cn("w-4 h-4 text-primary", error && "text-error")}
            />
          ) : (
            <Eye
              className={cn("w-4 h-4 text-primary", error && "text-error")}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
