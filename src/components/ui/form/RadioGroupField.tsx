
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  form,
  name,
  label,
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
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
