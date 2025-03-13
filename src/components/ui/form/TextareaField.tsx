
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormFieldProps } from "./FormField";
import { cn } from "@/lib/utils";

export interface TextareaFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  disabled,
  error,
  description,
  className,
}: TextareaFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
    </FormField>
  );
}
