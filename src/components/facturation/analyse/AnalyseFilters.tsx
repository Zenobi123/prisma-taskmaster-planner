
import { useState } from "react";
import { CalendarIcon, Download, FileText, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useClientData } from "@/hooks/facturation/clientFinancial/summary/useClientData";
import { exportToExcel, exportToPdf } from "@/utils/exportUtils";

interface AnalyseFiltersProps {
  period: "month" | "quarter" | "year";
  setPeriod: (period: "month" | "quarter" | "year") => void;
  clientFilter: string | null;
  setClientFilter: (clientId: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

const AnalyseFilters = ({
  period,
  setPeriod,
  clientFilter,
  setClientFilter,
  statusFilter,
  setStatusFilter
}: AnalyseFiltersProps) => {
  const { toast } = useToast();
  const { clients, isLoading } = useClientData();
  const [exportOpen, setExportOpen] = useState(false);

  const handleExportExcel = () => {
    try {
      exportToExcel([], "analyse_factures_paiements");
      toast({
        title: "Export réussi",
        description: "Le fichier Excel a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: "Impossible d'exporter les données en Excel",
      });
    }
    setExportOpen(false);
  };

  const handleExportPdf = () => {
    try {
      exportToPdf("Analyse des factures et paiements", [], "analyse_factures_paiements");
      toast({
        title: "Export réussi",
        description: "Le fichier PDF a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: "Impossible d'exporter les données en PDF",
      });
    }
    setExportOpen(false);
  };

  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <Select value={period} onValueChange={(value) => setPeriod(value as "month" | "quarter" | "year")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mois en cours</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <Select value={clientFilter || ""} onValueChange={(value) => setClientFilter(value || null)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les clients</SelectItem>
                {!isLoading && clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.type === 'physique' ? client.nom : client.raisonsociale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="payée">Payée</SelectItem>
                <SelectItem value="partiellement_payée">Partiellement payée</SelectItem>
                <SelectItem value="non_payée">Non payée</SelectItem>
                <SelectItem value="en_retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Popover open={exportOpen} onOpenChange={setExportOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2">
                <Button 
                  variant="ghost" 
                  onClick={handleExportExcel}
                  className="w-full justify-start text-sm mb-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en Excel
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleExportPdf}
                  className="w-full justify-start text-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyseFilters;
