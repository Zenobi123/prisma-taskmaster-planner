import React, { useState } from "react";
import { Rapport } from "@/types/rapport";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, FileSpreadsheet, FilePieChart, FileBarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RapportsListProps {
  rapports: Rapport[];
  isLoading: boolean;
}

export function RapportsList({ rapports, isLoading }: RapportsListProps) {
  const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);

  // Function to get the appropriate icon for a report type
  const getReportIcon = (type: string) => {
    switch (type) {
      case "fiscal":
        return <FileText className="w-8 h-8 text-blue-400" />;
      case "client":
        return <FileText className="w-8 h-8 text-green-400" />;
      case "financier":
        return <FilePieChart className="w-8 h-8 text-violet-400" />;
      case "activite":
        return <FileBarChart className="w-8 h-8 text-amber-400" />;
      default:
        return <FileSpreadsheet className="w-8 h-8 text-gray-400" />;
    }
  };

  // Function to get the appropriate badge color for a report type
  const getReportBadgeVariant = (type: string): "default" | "outline" | "secondary" | "destructive" => {
    switch (type) {
      case "fiscal":
        return "default";
      case "client":
        return "secondary";
      case "financier":
        return "outline";
      case "activite":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Function to handle report download
  const handleDownload = (rapport: Rapport) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading report: ${rapport.titre}`);
    // For demo purposes, show a dummy download notification
    alert(`Téléchargement du rapport: ${rapport.titre}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-4">
                <Skeleton className="w-8 h-8 rounded" />
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (rapports.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium">Aucun rapport trouvé</h3>
        <p className="text-muted-foreground mt-1">
          Aucun rapport ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {rapports.map((rapport) => (
          <div
            key={rapport.id}
            className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-4">
                {getReportIcon(rapport.type)}
                <div>
                  <h3 className="font-semibold text-lg">{rapport.titre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {rapport.date} • {rapport.taille}
                    </span>
                    <Badge variant={getReportBadgeVariant(rapport.type)} className="text-xs">
                      {rapport.type === "fiscal" && "Fiscal"}
                      {rapport.type === "client" && "Client"}
                      {rapport.type === "financier" && "Financier"}
                      {rapport.type === "activite" && "Activité"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Visualiser"
                  onClick={() => setSelectedRapport(rapport)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => handleDownload(rapport)}
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Viewer Dialog */}
      <Dialog open={!!selectedRapport} onOpenChange={(open) => !open && setSelectedRapport(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRapport?.titre}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RapportViewer rapport={selectedRapport} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Report Viewer Component
function RapportViewer({ rapport }: { rapport: Rapport | null }) {
  if (!rapport) return null;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline">{rapport.type}</Badge>
        <span className="text-sm text-gray-500">{rapport.date}</span>
        <span className="text-sm text-gray-500">{rapport.taille}</span>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg min-h-[400px]">
        <div className="text-center my-8">
          <h2 className="text-2xl font-bold mb-2">{rapport.titre}</h2>
          <p className="text-gray-500">Date: {rapport.date}</p>
        </div>
        
        <div className="mt-8 text-gray-700">
          <p className="mb-4">
            Ce rapport est une visualisation simulée à des fins de démonstration.
          </p>
          <p className="mb-4">
            Dans une application réelle, le contenu complet du rapport serait affiché ici.
          </p>
          <p>
            Type de rapport: {rapport.type === "fiscal" ? "Fiscal" : 
                            rapport.type === "client" ? "Client" : 
                            rapport.type === "financier" ? "Financier" : "Activité"}
          </p>
        </div>
      </div>
    </div>
  );
}
