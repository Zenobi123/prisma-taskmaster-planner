
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  layout = 'vertical',
  columns = 2,
  required = false,
  disabled = false,
  error,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          className={cn(error && "text-destructive")}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          layout === 'vertical' && "flex flex-col space-y-2",
          layout === 'horizontal' && "flex flex-row space-x-4 flex-wrap",
          layout === 'grid' && `grid grid-cols-1 md:grid-cols-${columns} gap-2`
        )}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label 
              htmlFor={`${id}-${option.value}`} 
              className="cursor-pointer font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};
