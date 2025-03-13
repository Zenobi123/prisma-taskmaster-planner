
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface CheckboxFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  form,
  name,
  label,
  description,
  disabled = false,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

import { cn } from '@/lib/utils';
