
import { useState } from "react";

interface FormFieldState<T> {
  value: T;
  error: string | undefined;
  touched: boolean;
}

type Validator<T> = (value: T) => string | undefined;

interface UseFormFieldOptions<T> {
  initialValue: T;
  validators?: Validator<T>[];
}

export function useFormField<T>({ initialValue, validators = [] }: UseFormFieldOptions<T>) {
  const [state, setState] = useState<FormFieldState<T>>({
    value: initialValue,
    error: undefined,
    touched: false,
  });

  const setValue = (newValue: T) => {
    setState((prevState) => ({
      ...prevState,
      value: newValue,
      error: validate(newValue),
      touched: true,
    }));
  };

  const validate = (value: T): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };

  const reset = () => {
    setState({
      value: initialValue,
      error: undefined,
      touched: false,
    });
  };

  return {
    value: state.value,
    error: state.touched ? state.error : undefined,
    touched: state.touched,
    setValue,
    validate,
    reset,
  };
}

// Validators pré-définis couramment utilisés
export const validators = {
  required: (message = "Ce champ est requis") => (value: any) => {
    if (value === undefined || value === null || value === "") {
      return message;
    }
    return undefined;
  },
  email: (message = "Format d'email invalide") => (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? undefined : message;
  },
  minLength: (min: number, message?: string) => (value: string) => {
    if (!value) return undefined;
    return value.length >= min ? undefined : message || `Minimum ${min} caractères requis`;
  },
  phone: (message = "Format de téléphone invalide") => (value: string) => {
    if (!value) return undefined;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value) ? undefined : message;
  },
  numeric: (message = "Doit être un nombre") => (value: string) => {
    if (!value) return undefined;
    return !isNaN(Number(value)) ? undefined : message;
  }
};
