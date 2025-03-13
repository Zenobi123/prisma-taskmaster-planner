
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormFieldProps } from "./FormField";
import { Label } from "@/components/ui/label";

export interface CheckboxFieldProps extends Omit<FormFieldProps, "children" | "label"> {
  id: string;
  label: string;
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
    <div className={className}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {description && (
        <p className="text-xs text-neutral-500 mt-1 ml-6">{description}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1 ml-6">{error}</p>}
    </div>
  );
}
