
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormFieldProps } from "./FormField";

export interface TextFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password" | "number";
  disabled?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
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
        required={required}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
      />
    </FormField>
  );
}
