
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart, Calendar, FileBarChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ReportTypeFilter } from "@/components/rapports/ReportTypeFilter";
import { SearchInput } from "@/components/rapports/SearchInput";
import { ReportCard } from "@/components/rapports/ReportCard";
import { EmptyState } from "@/components/rapports/EmptyState";
import { generateActivityReport } from "@/utils/reports/activityReport";
import { generateFinancialReport } from "@/utils/reports/financialReport";
import { generateTimeReport } from "@/utils/reports/timeReport";
import { generateClientReport } from "@/utils/reports/clientReport";

const Rapports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const rapports = [
    {
      id: 1,
      titre: "Rapport d'activité mensuel",
      date: "Février 2024",
      type: "activite",
      taille: "2.4 MB",
      icon: BarChart,
      description: "Synthèse des activités et performance mensuelle",
      generator: generateActivityReport
    },
    {
      id: 2,
      titre: "Bilan financier trimestriel",
      date: "Q4 2023",
      type: "financier",
      taille: "1.8 MB",
      icon: FileBarChart,
      description: "Analyse financière du dernier trimestre",
      generator: generateFinancialReport
    },
    {
      id: 3,
      titre: "Analyse des temps par projet",
      date: "Janvier 2024",
      type: "temps",
      taille: "1.2 MB",
      icon: Calendar,
      description: "Répartition du temps par projet et collaborateur",
      generator: generateTimeReport
    },
    {
      id: 4,
      titre: "Rapport clients",
      date: "Mars 2024",
      type: "clients",
      taille: "2.1 MB",
      icon: Users,
      description: "Analyse du portefeuille clients et activité",
      generator: generateClientReport
    }
  ];

  const filteredRapports = rapports.filter((rapport) => {
    const matchesType = typeFilter === "all" || rapport.type === typeFilter;
    const matchesSearch = searchQuery === "" || 
      rapport.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rapport.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownloadReport = (rapport: any) => {
    try {
      toast({
        title: "Génération en cours",
        description: `Préparation du rapport "${rapport.titre}"...`,
      });
      
      rapport.generator();
      
      toast({
        title: "Rapport généré",
        description: `Le rapport "${rapport.titre}" a été téléchargé avec succès.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport. Veuillez réessayer.",
        variant: "destructive"
      });
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
            Consultez et générez des rapports d'analyse
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <ReportTypeFilter value={typeFilter} onChange={setTypeFilter} />
      </div>

      <div className="grid gap-4">
        {filteredRapports.length > 0 ? (
          filteredRapports.map((rapport) => (
            <ReportCard
              key={rapport.id}
              {...rapport}
              onGenerate={() => handleDownloadReport(rapport)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Rapports;
