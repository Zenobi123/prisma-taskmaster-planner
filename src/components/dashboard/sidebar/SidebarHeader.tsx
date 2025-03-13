
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader = ({ isSidebarOpen, isMobile, toggleSidebar }: SidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-neutral-200">
      <div className="flex items-center justify-between">
        <h1
          className={cn(
            "font-semibold text-neutral-800 transition-opacity duration-300 whitespace-nowrap",
            !isSidebarOpen && "opacity-0 invisible"
          )}
        >
          PRISMA GESTION
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
          aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {isMobile && isSidebarOpen ? (
            <X className="w-5 h-5 text-neutral-600" />
          ) : (
            <Menu className="w-5 h-5 text-neutral-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
