import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { cn } from "@/utils/cn";

const DATE_FORMAT = "MMM d";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  side?: "top" | "bottom";
  dateFormat?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  className,
  disabled,
  side = "bottom",
  dateFormat = DATE_FORMAT,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [rawValue, setRawValue] = useState<string>("");
  const [month, setMonth] = useState<Date | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const getExpectedLength = (format: string) => {
    return format
      .replace(/MMM/g, "Jan")
      .replace(/MM/g, "12")
      .replace(/dd/g, "31")
      .replace(/yyyy/g, "2024").length;
  };

  useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  const isAllowedInput = (value: string, format: string) => {
    if (format === "MM/dd/yyyy") {
      return /^[0-9/]*$/.test(value);
    }

    if (format === "MMM d") {
      return /^[a-zA-Z\s0-9]*$/.test(value);
    }

    return true;
  };

  const expectedLength = useMemo(
    () => getExpectedLength(dateFormat),
    [dateFormat],
  );

  const handleInputChange = (value: string) => {
    if (!isAllowedInput(value, dateFormat)) {
      return;
    }

    if (date) {
      setDate(undefined);
    }

    setRawValue(value);

    if (value.length < expectedLength) {
      return;
    }

    const parsed = parse(value, dateFormat, new Date());

    if (isNaN(parsed.getTime())) {
      return;
    }

    setDate(parsed);
    setRawValue("");
  };

  const displayValue = useMemo(() => {
    if (rawValue) return rawValue;
    if (date) return format(date, dateFormat);
    return "";
  }, [rawValue, date, dateFormat]);

  const handleSelect = (selected?: Date) => {
    setDate(selected);
    setRawValue("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    onChange(date);
  }, [date, onChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn("flex cursor-default items-center", className)}
        onClick={(e) => e.preventDefault()}
      >
        <Input
          label={label}
          startIcon={<CalendarIcon />}
          onClick={() => setIsOpen(true)}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          ref={inputRef}
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="relative w-[350px]"
        side={side}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={month}
          today={new Date()}
          onMonthChange={setMonth}
          className="p-0"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
