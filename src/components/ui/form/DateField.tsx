
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormFieldProps } from "./FormField";
import { cn } from "@/lib/utils";

export interface DateFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
  error,
  description,
  className,
}: DateFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
    </FormField>
  );
}
