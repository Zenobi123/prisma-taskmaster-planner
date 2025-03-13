
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface MenuCategoryProps {
  category: string;
  categoryLabel: string;
  items: MenuItem[];
  isSidebarOpen: boolean;
  handleMobileClose: () => void;
}

const MenuCategory = ({ 
  category, 
  categoryLabel, 
  items, 
  isSidebarOpen,
  handleMobileClose 
}: MenuCategoryProps) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div key={category} className="space-y-1">
      {isSidebarOpen && (
        <h2 className="text-xs font-semibold text-neutral-500 uppercase px-3 py-2">
          {categoryLabel}
        </h2>
      )}
      
      <div className="space-y-1">
        {items.map((item) => (
          <TooltipProvider key={item.path} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  onClick={handleMobileClose}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all group relative",
                    isActiveRoute(item.path) 
                      ? "bg-[#84A98C] text-white" 
                      : "text-neutral-600 hover:bg-[#F2FCE2] hover:text-neutral-800",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0",
                    isActiveRoute(item.path) && "text-white"
                  )} />
                  <span
                    className={cn(
                      "ml-3 transition-opacity duration-300 whitespace-nowrap",
                      !isSidebarOpen && "opacity-0 invisible absolute"
                    )}
                  >
                    {item.label}
                  </span>
                  {!isSidebarOpen && (
                    <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </div>
                  )}
                  {isActiveRoute(item.path) && isSidebarOpen && (
                    <ChevronRight className="w-4 h-4 ml-auto text-white" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                {!isSidebarOpen && item.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
