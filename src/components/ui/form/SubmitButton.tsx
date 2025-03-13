
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting?: boolean;
  submitText: string;
  submittingText?: string;
  disabled?: boolean;
  className?: string;
}

const SubmitButton = ({
  isSubmitting = false,
  submitText,
  submittingText = "En cours...",
  disabled = false,
  className,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || disabled}
      className={className}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submittingText}
        </>
      ) : (
        submitText
      )}
    </Button>
  );
};

export default SubmitButton;
