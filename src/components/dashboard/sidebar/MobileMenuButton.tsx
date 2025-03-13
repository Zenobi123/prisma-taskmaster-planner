
import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-[#84A98C] text-white shadow-lg hover:bg-[#6B8E74] transition-colors"
      aria-label="Ouvrir le menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

export default MobileMenuButton;
