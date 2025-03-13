
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
  label?: string;
}

const SubmitButton = ({ 
  loading = false, 
  label = "Soumettre", 
  disabled, 
  children, 
  ...props 
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children || label}
    </Button>
  );
};

export default SubmitButton;
