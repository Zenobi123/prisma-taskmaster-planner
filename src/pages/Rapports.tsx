
import { useState } from "react";
import { useRapports } from "@/hooks/useRapports";
import { exportToPdf, exportToExcel } from "@/utils/exportUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateReportDialog } from "@/components/rapports/GenerateReportDialog";
import { RapportsHeader } from "@/components/rapports/RapportsHeader";
import { RapportsTabContent } from "@/components/rapports/RapportsTabContent";
import { StatisticsTabContent } from "@/components/rapports/StatisticsTabContent";

const Rapports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { 
    rapports, 
    isLoading, 
    generateReport 
  } = useRapports(typeFilter, searchTerm, selectedPeriod, selectedDate);

  const handleGenerate = (type: string, parameters: any) => {
    generateReport(type, parameters);
    setShowGenerateDialog(false);
  };

  const handleExport = (format: "pdf" | "excel") => {
    if (format === "pdf") {
      exportToPdf("Rapports", rapports, "rapports-export");
    } else {
      exportToExcel(rapports, "rapports-export");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <RapportsHeader 
        onGenerateReport={() => setShowGenerateDialog(true)} 
      />

      <Tabs defaultValue="rapports" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="rapports">Rapports disponibles</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rapports">
          <RapportsTabContent
            rapports={rapports}
            isLoading={isLoading}
            searchTerm={searchTerm}
            typeFilter={typeFilter}
            selectedPeriod={selectedPeriod}
            selectedDate={selectedDate}
            onSearchChange={setSearchTerm}
            onTypeChange={setTypeFilter}
            onPeriodChange={setSelectedPeriod}
            onDateChange={setSelectedDate}
            onExportPdf={() => handleExport("pdf")}
            onExportExcel={() => handleExport("excel")}
          />
        </TabsContent>
        
        <TabsContent value="statistiques">
          <StatisticsTabContent />
        </TabsContent>
      </Tabs>
      
      <GenerateReportDialog 
        isOpen={showGenerateDialog} 
        onClose={() => setShowGenerateDialog(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default Rapports;
