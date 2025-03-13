
import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  icon: LucideIcon;
  label: string;
  category: string;
}

export interface CategoryLabels {
  [key: string]: string;
}
