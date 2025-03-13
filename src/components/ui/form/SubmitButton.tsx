
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubmitButtonProps {
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
  className?: string;
}

export function SubmitButton({
  isSubmitting = false,
  submitText = "Enregistrer",
  submittingText = "Enregistrement...",
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn("", className)}
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
}
