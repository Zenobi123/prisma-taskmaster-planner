
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Download, Filter, Search, Calendar, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRapports } from "@/hooks/useRapports";
import { exportToPdf, exportToExcel } from "@/utils/exportUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RapportsList } from "@/components/rapports/RapportsList";
import { GenerateReportDialog } from "@/components/rapports/GenerateReportDialog";

const Rapports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

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
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-neutral-600 mt-1">
            Consultez et générez des rapports
          </p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)}>
          Générer un rapport
        </Button>
      </div>

      <Tabs defaultValue="rapports" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="rapports">Rapports disponibles</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rapports">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un rapport..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Type de rapport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="fiscal">Fiscal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="financier">Financier</SelectItem>
                    <SelectItem value="activite">Activité</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes périodes</SelectItem>
                    <SelectItem value="this_month">Ce mois</SelectItem>
                    <SelectItem value="this_year">Cette année</SelectItem>
                    <SelectItem value="last_year">Année précédente</SelectItem>
                    <SelectItem value="custom">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedPeriod === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full md:w-[200px]">
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? selectedDate.toLocaleDateString() : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exporter en PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport("excel")}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exporter en Excel
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <RapportsList 
                rapports={rapports} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistiques">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des rapports</CardTitle>
                <CardDescription>Par type de document</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileBarChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Statistiques disponibles prochainement</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rapports par période</CardTitle>
                <CardDescription>Évolution mensuelle</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileBarChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Statistiques disponibles prochainement</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
