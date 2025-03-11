
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DateInputProps {
  label: string;
  value: string;
  selected: Date;
  onInputChange: (value: string) => void;
  onCalendarSelect: (date: Date | undefined) => void;
  minDate?: Date;
}

export function DateInput({
  label,
  value,
  selected,
  onInputChange,
  onCalendarSelect,
  minDate,
}: DateInputProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">{label}</Label>
      <div className="col-span-3 flex gap-2 items-center">
        <Input
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full"
          placeholder="JJ/MM/AAAA"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="h-10 w-10 p-0">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={onCalendarSelect}
              initialFocus
              fromDate={minDate}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
