
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface TextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  type?: string;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  type = 'text',
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
            <Input 
              {...field} 
              type={type} 
              placeholder={placeholder} 
              disabled={disabled} 
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
