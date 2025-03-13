
import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-[#84A98C] text-white shadow-lg hover:bg-[#6B8E74] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      aria-label="Ouvrir le menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

export default MobileMenuButton;
