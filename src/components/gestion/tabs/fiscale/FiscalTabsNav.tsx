
import React from "react";
import { Card } from "@/components/ui/card";

interface FiscalTabOption {
  id: string;
  title: string;
  description: string;
}

interface FiscalTabsNavProps {
  options: FiscalTabOption[];
  onTabChange: (tab: string) => void;
}

export function FiscalTabsNav({ options, onTabChange }: FiscalTabsNavProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map((option) => (
        <Card 
          key={option.id}
          onClick={() => onTabChange(option.id)} 
          className="cursor-pointer hover-lift hover:border-primary transition-colors"
        >
          <div className="p-4">
            <h3 className="text-lg font-medium">{option.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {option.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
