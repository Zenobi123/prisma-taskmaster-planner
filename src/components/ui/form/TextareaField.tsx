
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface TextareaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  rows = 4,
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
            <Textarea 
              {...field} 
              placeholder={placeholder} 
              disabled={disabled} 
              rows={rows}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
