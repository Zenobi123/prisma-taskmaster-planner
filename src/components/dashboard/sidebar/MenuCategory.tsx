
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebarResponsive } from "./useSidebarResponsive";
import { MenuItem } from "./types";

interface MenuCategoryProps {
  category: string;
  categoryLabel: string;
  items: MenuItem[];
  isSidebarOpen: boolean;
  handleMobileClose: () => void;
}

export function MenuCategory({ 
  category, 
  categoryLabel, 
  items, 
  isSidebarOpen,
  handleMobileClose
}: MenuCategoryProps) {
  const { pathname } = useLocation();

  const renderItem = (item: MenuItem, index: number) => {
    const isActive = pathname === item.path;

    return (
      <Link
        key={index}
        to={item.path}
        className={cn(
          "flex items-center gap-x-3 p-2 rounded-md text-sm group relative",
          isActive
            ? "bg-neutral-100 text-neutral-900 font-medium dark:bg-neutral-800 dark:text-neutral-100"
            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
        )}
        onClick={handleMobileClose}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span
          className={cn(
            "transition-all duration-300",
            !isSidebarOpen && "opacity-0 absolute"
          )}
        >
          {item.label}
        </span>
        {!isSidebarOpen && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="absolute inset-0 z-10" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Link>
    );
  };

  return (
    <div>
      <div className="mb-2 px-3 text-sm font-medium">{categoryLabel}</div>
      <div className="space-y-1">{items.map(renderItem)}</div>
    </div>
  );
}
