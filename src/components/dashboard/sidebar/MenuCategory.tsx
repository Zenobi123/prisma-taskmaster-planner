
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

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface MenuCategoryProps {
  title: string;
  items: MenuItem[];
}

export function MenuCategory({ title, items }: MenuCategoryProps) {
  const { pathname } = useLocation();
  const { isSidebarOpen } = useSidebarResponsive();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderItem = (item: MenuItem, index: number) => {
    return (
      <Link
        key={index}
        to={item.path}
        className={cn(
          "flex items-center gap-x-3 p-2 rounded-md text-sm group relative",
          pathname === item.path
            ? "bg-neutral-100 text-neutral-900 font-medium dark:bg-neutral-800 dark:text-neutral-100"
            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
        )}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span
          className={cn(
            "transition-all duration-300",
            !isSidebarOpen && "opacity-0 absolute"
          )}
        >
          {item.name}
        </span>
        {!isSidebarOpen && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="absolute inset-0 z-10" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Link>
    );
  };

  return (
    <div>
      <div className="mb-2 px-3 text-sm font-medium">{title}</div>
      <div className="space-y-1">{items.map(renderItem)}</div>
    </div>
  );
}
