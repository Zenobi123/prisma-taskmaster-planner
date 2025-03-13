
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  render: (props: {
    field: {
      value: any;
      onChange: (value: any) => void;
      onBlur: () => void;
      ref: React.Ref<any>;
    };
    fieldState: {
      invalid: boolean;
      error?: {
        message?: string;
      };
    };
  }) => React.ReactNode;
}

function FormField<T extends FieldValues>({
  name,
  control,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => render({ field, fieldState })}
    />
  );
}

export default FormField;
