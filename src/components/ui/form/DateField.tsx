
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  min?: string;
  max?: string;
}

const DateField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className,
  min,
  max,
}: DateFieldProps) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default DateField;
