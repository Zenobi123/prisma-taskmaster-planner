
export interface MenuItem {
  path: string;
  icon: React.ComponentType;
  label: string;
  category: string;
}

export interface CategoryLabels {
  [key: string]: string;
}
