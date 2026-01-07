import { format, parse } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { type DateRange } from "react-day-picker";

import { Input } from "@/components/ui/Input";
import { Calendar } from "@/components/ui/Calendar";
import InputError from "@/components/ui/InputError";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";

const DATE_FORMAT = "MMM d";

interface DatesPickerProps {
  onChange: (range?: DateRange) => void;
  startDateError?: string;
  endDateError?: string;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const DatesPicker: React.FC<DatesPickerProps> = ({
  onChange,
  startDateError,
  endDateError,
  initialStartDate,
  initialEndDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    initialStartDate && initialEndDate
      ? { from: initialStartDate, to: initialEndDate }
      : undefined,
  );
  const [rawRange, setRawRange] = useState<
    { from?: string; to?: string } | undefined
  >();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (value: string, type: "from" | "to") => {
    if (value === "") {
      setRange((prev) => ({
        ...prev,
        [type]: undefined,
      }));
      setRawRange((prev) => ({
        ...prev,
        [type]: "",
      }));
      return;
    }
    const parsed = parse(value, DATE_FORMAT, new Date());
    if (!isNaN(parsed.getTime())) {
      setRange((prev) => ({
        ...prev,
        [type]: parsed,
      }));
      setRawRange((prev) => ({
        ...prev,
        [type]: undefined,
      }));
    } else {
      setRawRange((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const startDate = useMemo(() => {
    if (rawRange?.from !== undefined) {
      return rawRange.from;
    }

    if (range?.from) {
      return format(range.from, DATE_FORMAT);
    }
    return "";
  }, [rawRange, range]);

  const endDate = useMemo(() => {
    if (rawRange?.to !== undefined) {
      return rawRange.to;
    }

    if (range?.to) {
      return format(range.to, DATE_FORMAT);
    }
    return "";
  }, [rawRange, range]);

  const handleSelect = (range: DateRange) => {
    setRange(range);
    if (range?.from) {
      startDateRef.current?.focus();
      setRawRange((prev) => ({
        ...prev,
        from: undefined,
      }));
    }
    if (range?.to) {
      endDateRef.current?.focus();
      setRawRange((prev) => ({
        ...prev,
        to: undefined,
      }));
    }
  };

  useEffect(() => {
    onChange(range);
  }, [range, onChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="flex items-center gap-2 cursor-default"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div className="grid grid-cols-[auto_18px_auto] gap-x-2 items-center w-full">
          <Input
            label="Start date"
            startIcon={<CalendarIcon />}
            onClick={() => setIsOpen(true)}
            value={startDate}
            onChange={(e) => handleInputChange(e.target.value, "from")}
            ref={startDateRef}
            error={!!startDateError}
          />
          <ArrowRightIcon className="w-4 h-4 text-neutral-500" />
          <Input
            label="End date"
            startIcon={<CalendarIcon />}
            onClick={() => setIsOpen(true)}
            value={endDate}
            onChange={(e) => handleInputChange(e.target.value, "to")}
            ref={endDateRef}
            error={!!endDateError}
          />
          <div>
            <InputError error={startDateError} />
          </div>
          <div></div>
          <div>
            <InputError error={endDateError} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="relative w-[350px]"
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={range?.from ? { before: range.from } : undefined}
          className="p-0"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatesPicker;
