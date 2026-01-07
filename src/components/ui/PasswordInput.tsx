import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { cn } from "@/utils/cn.ts";

import { Input, type InputProps } from "./Input";

type PasswordInputProps<T extends FieldValues> = Omit<
  InputProps,
  "type" | "startIcon" | "label"
> & {
  name: Path<T>;
  control: Control<T>;
};

const PasswordInput = <T extends FieldValues>({
  name,
  control,
  ...props
}: PasswordInputProps<T>) => {
  const {
    field: { value, onChange, ref },
    fieldState: { error },
  } = useController<T>({ name, control });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    },
    [],
  );

  return (
    <div className="relative">
      <Input
        {...props}
        label="Password"
        ref={ref}
        value={value ?? ""}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        startIcon={<LockIcon />}
        error={!!error}
        isEmpty={!value}
      />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleShowPassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
      >
        {showPassword ? (
          <EyeOff
            className={cn("w-4 h-4 text-primary", error && "text-error")}
          />
        ) : (
          <Eye className={cn("w-4 h-4 text-primary", error && "text-error")} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
