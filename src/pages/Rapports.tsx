
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart, Calendar, FileBarChart, Users, DollarSign, FileText, Clock, TrendingUp, Building, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ReportTypeFilter } from "@/components/rapports/ReportTypeFilter";
import { SearchInput } from "@/components/rapports/SearchInput";
import { ReportCard } from "@/components/rapports/ReportCard";
import { EmptyState } from "@/components/rapports/EmptyState";

// Import des générateurs de rapports
import { generateActivityReport } from "@/utils/reports/activityReport";
import { generateFinancialReport } from "@/utils/reports/financialReport";
import { generateTimeReport } from "@/utils/reports/timeReport";
import { generateClientReport } from "@/utils/reports/clientReport";

// Nouveaux générateurs
import { 
  generateChiffresAffairesReport, 
  generateFacturationReport, 
  generateCreancesReport 
} from "@/utils/reports/financialReports";
import { 
  generatePortefeuilleClientsReport, 
  generateNouveauxClientsReport, 
  generateActiviteClientsReport 
} from "@/utils/reports/clientReports";
import { 
  generateObligationsFiscalesReport, 
  generateRetardsFiscauxReport 
} from "@/utils/reports/fiscalReports";
import { 
  generateMassSalarialeReport, 
  generateEffectifsReport 
} from "@/utils/reports/rhReports";
import { 
  generateTachesReport, 
  generatePerformanceCollaborateursReport 
} from "@/utils/reports/operationalReports";

// Nouveaux rapports clients spécifiques
import {
  generatePersonnesMoralesReport,
  generatePersonnesPhysiquesReport,
  generateClientsParCentreReport,
  generateClientsAssujettisIGSReport,
  generateClientsAssujettsPatenteReport
} from "@/utils/reports/specificClientReports";

const Rapports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const rapports = [
    // Rapports financiers
    {
      id: 1,
      titre: "Chiffre d'Affaires",
      date: new Date().toLocaleDateString(),
      type: "financier",
      taille: "1.2 MB",
      icon: DollarSign,
      description: "Évolution mensuelle du chiffre d'affaires et des encaissements",
      generator: generateChiffresAffairesReport
    },
    {
      id: 2,
      titre: "Rapport de Facturation",
      date: new Date().toLocaleDateString(),
      type: "financier",
      taille: "2.1 MB",
      icon: FileText,
      description: "Détail de toutes les factures émises avec statuts de paiement",
      generator: generateFacturationReport
    },
    {
      id: 3,
      titre: "Créances Clients",
      date: new Date().toLocaleDateString(),
      type: "financier",
      taille: "0.8 MB",
      icon: TrendingUp,
      description: "Suivi des créances et des retards de paiement",
      generator: generateCreancesReport
    },

    // Rapports clients généraux
    {
      id: 4,
      titre: "Portefeuille Clients",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.5 MB",
      icon: Users,
      description: "Vue d'ensemble complète du portefeuille clients",
      generator: generatePortefeuilleClientsReport
    },
    {
      id: 5,
      titre: "Nouveaux Clients",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "0.6 MB",
      icon: Users,
      description: "Clients acquis au cours des 6 derniers mois",
      generator: generateNouveauxClientsReport
    },
    {
      id: 6,
      titre: "Activité par Client",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.8 MB",
      icon: BarChart,
      description: "Analyse de l'activité commerciale par client",
      generator: generateActiviteClientsReport
    },

    // Nouveaux rapports clients spécifiques
    {
      id: 16,
      titre: "Personnes Morales",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.2 MB",
      icon: Building,
      description: "Liste complète des clients personnes morales avec leurs caractéristiques",
      generator: generatePersonnesMoralesReport
    },
    {
      id: 17,
      titre: "Personnes Physiques",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.0 MB",
      icon: User,
      description: "Liste complète des clients personnes physiques avec leurs informations",
      generator: generatePersonnesPhysiquesReport
    },
    {
      id: 18,
      titre: "Clients par Centre des Impôts",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.3 MB",
      icon: FileText,
      description: "Répartition des clients par centre de rattachement fiscal",
      generator: generateClientsParCentreReport
    },
    {
      id: 19,
      titre: "Clients Assujettis IGS",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "0.9 MB",
      icon: DollarSign,
      description: "Liste des clients assujettis à l'Impôt Général sur le Salaire",
      generator: generateClientsAssujettisIGSReport
    },
    {
      id: 20,
      titre: "Clients Assujettis Patente",
      date: new Date().toLocaleDateString(),
      type: "clients",
      taille: "1.1 MB",
      icon: FileBarChart,
      description: "Liste des clients assujettis à la Patente (activités commerciales/industrielles)",
      generator: generateClientsAssujettsPatenteReport
    },

    // Rapports fiscaux
    {
      id: 7,
      titre: "Obligations Fiscales",
      date: new Date().toLocaleDateString(),
      type: "fiscal",
      taille: "2.3 MB",
      icon: FileText,
      description: "État des obligations fiscales de tous les clients",
      generator: generateObligationsFiscalesReport
    },
    {
      id: 8,
      titre: "Retards Fiscaux",
      date: new Date().toLocaleDateString(),
      type: "fiscal",
      taille: "1.1 MB",
      icon: Clock,
      description: "Clients en retard sur leurs obligations fiscales",
      generator: generateRetardsFiscauxReport
    },

    // Rapports RH/Paie
    {
      id: 9,
      titre: "Masse Salariale",
      date: new Date().toLocaleDateString(),
      type: "rh",
      taille: "1.4 MB",
      icon: DollarSign,
      description: "Analyse de la masse salariale par client et période",
      generator: generateMassSalarialeReport
    },
    {
      id: 10,
      titre: "Effectifs",
      date: new Date().toLocaleDateString(),
      type: "rh",
      taille: "0.9 MB",
      icon: Users,
      description: "État des effectifs par client avec détails des contrats",
      generator: generateEffectifsReport
    },

    // Rapports opérationnels
    {
      id: 11,
      titre: "Suivi des Tâches",
      date: new Date().toLocaleDateString(),
      type: "operationnel",
      taille: "1.6 MB",
      icon: Calendar,
      description: "État d'avancement des tâches par collaborateur",
      generator: generateTachesReport
    },
    {
      id: 12,
      titre: "Performance Collaborateurs",
      date: new Date().toLocaleDateString(),
      type: "operationnel",
      taille: "1.0 MB",
      icon: TrendingUp,
      description: "Indicateurs de performance et taux de completion",
      generator: generatePerformanceCollaborateursReport
    },

    // Rapports existants mis à jour
    {
      id: 13,
      titre: "Rapport d'activité mensuel",
      date: "Février 2024",
      type: "activite",
      taille: "2.4 MB",
      icon: BarChart,
      description: "Synthèse des activités et performance mensuelle",
      generator: generateActivityReport
    },
    {
      id: 14,
      titre: "Bilan financier trimestriel",
      date: "Q4 2023",
      type: "financier",
      taille: "1.8 MB",
      icon: FileBarChart,
      description: "Analyse financière du dernier trimestre",
      generator: generateFinancialReport
    },
    {
      id: 15,
      titre: "Analyse des temps par projet",
      date: "Janvier 2024",
      type: "temps",
      taille: "1.2 MB",
      icon: Calendar,
      description: "Répartition du temps par projet et collaborateur",
      generator: generateTimeReport
    }
  ];

  const filteredRapports = rapports.filter((rapport) => {
    const matchesType = typeFilter === "all" || rapport.type === typeFilter;
    const matchesSearch = searchQuery === "" || 
      rapport.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rapport.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownloadReport = async (rapport: any) => {
    try {
      toast({
        title: "Génération en cours",
        description: `Préparation du rapport "${rapport.titre}"...`,
      });
      
      await rapport.generator();
      
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
            Consultez et générez des rapports d'analyse détaillés
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
