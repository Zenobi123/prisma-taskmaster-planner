
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function GestionTabsList({ activeTab, onTabChange }: TabsListProps) {
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex space-x-2 min-w-max">
        {[
          { value: "entreprise", label: "Gestion d'entreprise" },
          { value: "fiscal", label: "Gestion fiscale" },
          { value: "comptable", label: "Gestion comptable" },
          { value: "dossier", label: "Gestion documentaire" }
        ].map(tab => (
          <div
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              px-4 py-3 rounded-md cursor-pointer transition-all duration-300
              ${
                activeTab === tab.value
                  ? "bg-primary text-white font-medium shadow-md border-b-2 border-primary-hover"
                  : "bg-white text-neutral-700 hover:bg-[#F2FCE2] border border-neutral-200"
              }
            `}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}
