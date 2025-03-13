
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MenuItemType } from "./types";

interface MenuCategoryProps {
  category: string;
  categoryLabel: string;
  items: MenuItemType[];
  isSidebarOpen: boolean;
  handleMobileClose: () => void;
  className?: string;
}

export function MenuCategory({ 
  category, 
  categoryLabel, 
  items, 
  isSidebarOpen, 
  handleMobileClose,
  className
}: MenuCategoryProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={cn("space-y-1", className)}>
      {/* Category Label */}
      <div 
        className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 cursor-pointer"
        onClick={toggleExpand}
      >
        {isSidebarOpen ? (
          <>
            <span>{categoryLabel}</span>
            {isExpanded ? 
              <ChevronUp size={14} /> : 
              <ChevronDown size={14} />
            }
          </>
        ) : null}
      </div>
      
      {/* Menu Items */}
      <div className={cn(
        "space-y-1 transition-all duration-200 ease-in-out",
        !isExpanded && "hidden"
      )}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleMobileClose}
            className={({ isActive }) => cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-neutral-100 text-primary dark:bg-neutral-800"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
              !isSidebarOpen && "justify-center"
            )}
          >
            {item.icon && (
              <item.icon 
                size={isSidebarOpen ? 18 : 20} 
                className={cn(
                  "flex-shrink-0",
                  isSidebarOpen ? "mr-2" : "mr-0"
                )} 
              />
            )}
            {isSidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
