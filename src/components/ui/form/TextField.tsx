
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const TextField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  error,
  className,
}: TextFieldProps) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default TextField;
