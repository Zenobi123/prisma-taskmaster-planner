
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  submitText?: string;
  submittingText?: string;
  disabled?: boolean;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting = false,
  submitText = "Enregistrer",
  submittingText = "Chargement...",
  disabled = false,
  className,
}) => {
  return (
    <Button 
      type="submit" 
      disabled={disabled || isSubmitting} 
      className={className}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? submittingText : submitText}
    </Button>
  );
};
