
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export const BackButton = ({ 
  onClick, 
  label = "Retour", 
  className = "" 
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`flex items-center gap-2 hover:bg-[#F2FCE2] ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};
