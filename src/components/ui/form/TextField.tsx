
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormFieldProps } from "./FormField";
import { cn } from "@/lib/utils";

export interface TextFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
  error,
  description,
  className,
}: TextFieldProps) {
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
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
    </FormField>
  );
}
