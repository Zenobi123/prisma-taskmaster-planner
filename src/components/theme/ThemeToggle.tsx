
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
  isSidebarOpen?: boolean;
}

const ThemeToggle = ({ isSidebarOpen = true }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`transition-all group relative text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 ${
              !isSidebarOpen && "justify-center w-10 px-0"
            }`}
            size="sm"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            
            <span
              className={`ml-2 transition-opacity duration-300 ${
                !isSidebarOpen && "opacity-0 invisible absolute"
              }`}
            >
              {theme === "light" ? "Mode sombre" : "Mode clair"}
            </span>
            
            {!isSidebarOpen && (
              <div className="absolute left-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {theme === "light" ? "Mode sombre" : "Mode clair"}
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {!isSidebarOpen && (theme === "light" ? "Mode sombre" : "Mode clair")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
