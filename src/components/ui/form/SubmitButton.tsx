
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface SubmitButtonProps extends ButtonProps {
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
}

export function SubmitButton({
  isSubmitting = false,
  submitText = "Enregistrer",
  submittingText = "Enregistrement...",
  className,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={className}
      {...props}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? submittingText : (children || submitText)}
    </Button>
  );
}
