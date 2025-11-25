import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerProps {
  value?: string;
  onChange: (date: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  dateFormat?: string;
  timePicker?: boolean;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Selecione uma data",
  dateFormat = "dd/MM/yyyy",
  timePicker = false,
  id,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [hours, setHours] = React.useState<string>(value ? format(new Date(value), "HH") : "00");
  const [minutes, setMinutes] = React.useState<string>(value ? format(new Date(value), "mm") : "00");

  React.useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        setHours(format(parsedDate, "HH"));
        setMinutes(format(parsedDate, "mm"));
      } else {
        setDate(undefined);
        setHours("00");
        setMinutes("00");
      }
    } else {
      setDate(undefined);
      setHours("00");
      setMinutes("00");
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      let newDate = selectedDate;
      if (timePicker) {
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
      } else {
        newDate.setHours(0, 0, 0, 0);
      }
      setDate(newDate);
      onChange(newDate.toISOString());
    } else {
      setDate(undefined);
      onChange(undefined);
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const numVal = parseInt(val, 10);
    if (isNaN(numVal)) return;

    if (type === 'hours') {
      setHours(val.padStart(2, '0'));
    } else {
      setMinutes(val.padStart(2, '0'));
    }

    if (date) {
      const newDate = new Date(date);
      newDate.setHours(type === 'hours' ? numVal : parseInt(hours, 10));
      newDate.setMinutes(type === 'minutes' ? numVal : parseInt(minutes, 10));
      setDate(newDate);
      onChange(newDate.toISOString());
    }
  };

  const displayValue = date
    ? format(date, timePicker ? `${dateFormat} HH:mm` : dateFormat, { locale: ptBR })
    : placeholder;

  const generateTimeOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const value = String(start + i).padStart(2, '0');
      return (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      );
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          id={id}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row gap-2" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          locale={ptBR}
          disabled={disabled}
        />
        {timePicker && (
          <div className="flex items-center justify-center gap-1 p-2 border-t sm:border-t-0 sm:border-l">
            <Select
              value={hours}
              onValueChange={(val) => handleTimeChange('hours', val)}
              disabled={disabled}
            >
              <SelectTrigger className="w-16 text-center">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions(0, 23)}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select
              value={minutes}
              onValueChange={(val) => handleTimeChange('minutes', val)}
              disabled={disabled}
            >
              <SelectTrigger className="w-16 text-center">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions(0, 59)}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
