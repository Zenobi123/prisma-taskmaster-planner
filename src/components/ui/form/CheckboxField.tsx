
import React from "react";
import { FormField } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  id: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  error,
}) => {
  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onChange(checked);
    }
  };

  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <Checkbox
        id={id}
        name={name || id}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
