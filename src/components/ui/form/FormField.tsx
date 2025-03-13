
import React from 'react';
import { FormControl, FormDescription, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  children: React.ReactElement;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  form,
  name,
  label,
  description,
  children,
  className,
}) => {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{React.cloneElement(children, { ...field })}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
