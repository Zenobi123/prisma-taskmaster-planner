
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface SubmitButtonProps {
  form: UseFormReturn<any>;
  loading?: boolean;
  text?: string;
  loadingText?: string;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  form,
  loading = false,
  text = 'Enregistrer',
  loadingText = 'Chargement...',
  className,
}) => {
  return (
    <Button 
      type="submit" 
      disabled={loading || !form.formState.isDirty || !form.formState.isValid} 
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText : text}
    </Button>
  );
};
