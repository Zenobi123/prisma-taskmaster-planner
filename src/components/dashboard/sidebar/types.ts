
import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  category: string;
}

export interface CategoryLabels {
  [key: string]: string;
}
