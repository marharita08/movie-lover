import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/cn";

import { Button } from "../ui/Button";
import { Input } from "./Input";

export interface NumberInputProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hideButtons?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  min = -Infinity,
  max = Infinity,
  value,
  step = 1,
  onChange,
  label,
  placeholder,
  className,
  disabled,
  hideButtons = false,
}) => {
  const [typedValue, setTypedValue] = useState(String(value));

  const handleMinus = () => {
    if (value !== undefined && value > min) {
      const decimals = step.toString().split(".")[1]?.length ?? 0;
      const newValue = parseFloat((value - step).toFixed(decimals));
      onChange(newValue);
      setTypedValue(String(newValue));
    }
  };

  const handlePlus = () => {
    if (value !== undefined && value < max) {
      const decimals = step.toString().split(".")[1]?.length ?? 0;
      const newValue = parseFloat((value + step).toFixed(decimals));
      onChange(newValue);
      setTypedValue(String(newValue));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const allowedPattern = /^-?\d*[.,]?\d*$/;
    if (!allowedPattern.test(input)) {
      return;
    }

    setTypedValue(input);

    const normalizedInput = input.replace(",", ".");

    if (
      normalizedInput === "-" ||
      normalizedInput === "-." ||
      normalizedInput.endsWith(".")
    ) {
      return;
    }

    let numericValue = parseFloat(normalizedInput);
    if (isNaN(numericValue)) return;

    if (numericValue > max) {
      numericValue = max;
      setTypedValue(String(max));
    }

    onChange(numericValue);
    setTypedValue(String(numericValue));
  };

  const handleBlur = () => {
    const normalized = typedValue.replace(",", ".");
    const decimals = step.toString().split(".")[1]?.length ?? 0;
    let numericValue = parseFloat(normalized);

    if (isNaN(numericValue)) {
      numericValue = min;
    }

    numericValue = parseFloat(
      Math.min(Math.max(numericValue, min), max).toFixed(decimals),
    );

    setTypedValue(numericValue.toString());
    if (numericValue !== value) {
      onChange(numericValue);
      setTypedValue(String(numericValue));
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        inputMode="decimal"
        label={label}
        placeholder={placeholder}
        value={typedValue}
        isEmpty={!value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="pr-8"
        disabled={disabled}
      />
      {!hideButtons && (
        <div className="absolute right-2 bottom-[3px] flex items-center justify-center flex-col text-muted-foreground">
          <Button
            className="p-0 h-[18px]"
            type="button"
            variant="ghost"
            onClick={handlePlus}
            disabled={disabled}
          >
            <ChevronUp className="w-[18px] h-[18px]" />
          </Button>
          <Button
            className="p-0 h-[18px]"
            type="button"
            variant="ghost"
            onClick={handleMinus}
            disabled={disabled}
          >
            <ChevronDown className="w-[18px] h-[18px]" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
