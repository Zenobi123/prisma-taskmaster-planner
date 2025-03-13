
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      className={className}
    >
      {loading ? "Chargement..." : children}
    </Button>
  );
};
