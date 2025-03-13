
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormFieldProps } from "./FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Sélectionner une option",
  required,
  disabled,
  error,
  description,
  className,
  maxHeight = 200,
}: SelectFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={cn("w-full bg-background border-input", error && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
          <ScrollArea className={`max-h-[${maxHeight}px]`}>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer hover:bg-neutral-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </FormField>
  );
}
