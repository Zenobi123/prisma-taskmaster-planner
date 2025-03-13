import { useState, useCallback } from "react";

export interface FormState {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

interface UseFormOptions<T extends FormState> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validators?: {
    [K in keyof T]?: (value: T[K], values: T) => string | undefined;
  };
}

// Common validators for forms
export const validators = {
  required: (message = "Ce champ est requis") => (value: any) => {
    if (value === undefined || value === null || value === "") {
      return message;
    }
    return undefined;
  },
  
  email: (message = "Format d'email invalide") => (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? undefined : message;
  },
  
  phone: (message = "Format de téléphone invalide") => (value: string) => {
    if (!value) return undefined;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value) ? undefined : message;
  },
  
  minLength: (length: number, message?: string) => (value: string) => {
    if (!value) return undefined;
    return value.length >= length 
      ? undefined 
      : message || `Doit contenir au moins ${length} caractères`;
  },
  
  maxLength: (length: number, message?: string) => (value: string) => {
    if (!value) return undefined;
    return value.length <= length 
      ? undefined 
      : message || `Ne doit pas dépasser ${length} caractères`;
  },
  
  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (!value) return undefined;
    return regex.test(value) ? undefined : message;
  },
  
  numeric: (message = "Ce champ doit contenir uniquement des chiffres") => (value: string) => {
    if (!value) return undefined;
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(value) ? undefined : message;
  },
  
  custom: (validationFn: (value: any) => string | undefined) => validationFn
};

export function useForm<T extends FormState>({
  initialValues,
  onSubmit,
  validators = {},
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      
      // Validate field if it has a validator
      if (validators[field]) {
        const error = validators[field]!(value, values);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
      
      // Mark field as touched
      if (!touched[field as string]) {
        setTouched((prev) => ({ ...prev, [field]: true }));
      }
    },
    [values, validators, touched]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(validators).forEach((field) => {
      const validator = validators[field as keyof T];
      if (validator) {
        const error = validator(values[field], values);
        newErrors[field] = error;
        if (error) {
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validators]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate the form
      const isValid = validateForm();
      
      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  };
}
