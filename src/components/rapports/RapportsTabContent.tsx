
import React from "react";
import { Rapport } from "@/types/rapport";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RapportsList } from "@/components/rapports/RapportsList";
import { RapportsFilters } from "@/components/rapports/RapportsFilters";
import { ExportButtons } from "@/components/rapports/ExportButtons";

interface RapportsTabContentProps {
  rapports: Rapport[];
  isLoading: boolean;
  searchTerm: string;
  typeFilter: string;
  selectedPeriod: string;
  selectedDate?: Date;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
}

export const RapportsTabContent = ({
  rapports,
  isLoading,
  searchTerm,
  typeFilter,
  selectedPeriod,
  selectedDate,
  onSearchChange,
  onTypeChange,
  onPeriodChange,
  onDateChange,
  onExportPdf,
  onExportExcel,
}: RapportsTabContentProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <RapportsFilters
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          selectedPeriod={selectedPeriod}
          selectedDate={selectedDate}
          onSearchChange={onSearchChange}
          onTypeChange={onTypeChange}
          onPeriodChange={onPeriodChange}
          onDateChange={onDateChange}
        />
      
        <ExportButtons
          onExportPdf={onExportPdf}
          onExportExcel={onExportExcel}
        />
        
        <Separator className="my-4" />
        
        <RapportsList 
          rapports={rapports} 
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};
