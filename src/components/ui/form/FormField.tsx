
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
}

export function FormField({
  id,
  label,
  children,
  required,
  error,
  description,
  className,
  showLabel = true,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none"
        >
          {required ? (
            <span>
              {label} <span className="text-red-500">*</span>
            </span>
          ) : (
            label
          )}
        </Label>
      )}
      
      {children}
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
