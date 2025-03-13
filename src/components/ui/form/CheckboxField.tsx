
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CheckboxField = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckboxFieldProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        className="font-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default CheckboxField;
