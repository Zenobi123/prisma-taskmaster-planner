
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormFieldProps } from "./FormField";
import { Label } from "@/components/ui/label";

export interface CheckboxFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  required,
  disabled,
  error,
  description,
  className,
}: CheckboxFieldProps) {
  return (
    <FormField
      id={id}
      required={required}
      error={error}
      description={description}
      className={className}
      showLabel={false}
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {required ? (
            <span>
              {label} <span className="text-red-500">*</span>
            </span>
          ) : (
            label
          )}
        </Label>
      </div>
    </FormField>
  );
}
