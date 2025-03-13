
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  options,
  disabled = false,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
