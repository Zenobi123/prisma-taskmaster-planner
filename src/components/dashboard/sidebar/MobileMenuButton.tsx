
import { Menu } from "lucide-react";
import { useState } from "react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    
    // Reset animation state after a short delay
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 left-4 z-50 p-3 rounded-full bg-[#84A98C] text-white shadow-lg transition-all ${
        isClicked ? "scale-95 bg-[#52796F]" : "hover:bg-[#6B8E74]"
      }`}
      aria-label="Ouvrir le menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

export default MobileMenuButton;
