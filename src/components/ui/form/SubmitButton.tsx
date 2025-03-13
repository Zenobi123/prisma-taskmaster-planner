
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  isSubmitting = false,
  disabled = false,
  className = "",
  submitText = "Enregistrer",
  submittingText = "Chargement...",
}) => {
  const isLoading = loading || isSubmitting;
  const buttonText = children || (isLoading ? submittingText : submitText);
  
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={className}
    >
      {buttonText}
    </Button>
  );
};
