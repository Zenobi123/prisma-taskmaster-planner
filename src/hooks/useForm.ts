
import { useState } from "react";

type ValidatorFn<T> = (value: any, formValues: T) => string | undefined;

export type Validators<T> = {
  [K in keyof T]?: ValidatorFn<T>;
};

interface UseFormProps<T extends Record<string, any>> {
  initialValues: T;
  validators?: Validators<T>;
  onSubmit: (values: T) => void;
}

export const validators = {
  required: (message = "Ce champ est requis") => 
    (value: any) => (!value && value !== 0) ? message : undefined,
  
  email: (message = "Format d'email invalide") => 
    (value: string) => {
      if (!value) return undefined;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : message;
    },
  
  phone: (message = "Format de téléphone invalide") => 
    (value: string) => {
      if (!value) return undefined;
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return phoneRegex.test(value) ? undefined : message;
    },

  minLength: (min: number, message = `Minimum ${min} caractères requis`) => 
    (value: string) => {
      if (!value) return undefined;
      return value.length < min ? message : undefined;
    },

  maxLength: (max: number, message = `Maximum ${max} caractères autorisés`) => 
    (value: string) => {
      if (!value) return undefined;
      return value.length > max ? message : undefined;
    }
};

export function useForm<T extends Record<string, any>>({
  initialValues,
  validators = {},
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any) => {
    const validator = validators[name];
    if (!validator) return undefined;
    return validator(value, values);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key in validators) {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (isValid) {
      onSubmit(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
}
