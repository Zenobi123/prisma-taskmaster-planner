import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Download, Calendar, BarChart, Users, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToPdf } from "@/utils/exportUtils";
import { toast } from "@/components/ui/use-toast";
import { DocumentService } from "@/utils/pdf/documentService";
import autoTable from "jspdf-autotable";

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
      icon: <BarChart className="h-8 w-8 text-gray-400" />,
      description: "Synthèse des activités et performance mensuelle",
      generator: generateActivityReport
    },
    {
      id: 2,
      titre: "Bilan financier trimestriel",
      date: "Q4 2023",
      type: "financier",
      taille: "1.8 MB",
      icon: <FileBarChart className="h-8 w-8 text-gray-400" />,
      description: "Analyse financière du dernier trimestre",
      generator: generateFinancialReport
    },
    {
      id: 3,
      titre: "Analyse des temps par projet",
      date: "Janvier 2024",
      type: "temps",
      taille: "1.2 MB",
      icon: <Calendar className="h-8 w-8 text-gray-400" />,
      description: "Répartition du temps par projet et collaborateur",
      generator: generateTimeReport
    },
    {
      id: 4,
      titre: "Rapport clients",
      date: "Mars 2024",
      type: "clients",
      taille: "2.1 MB",
      icon: <Users className="h-8 w-8 text-gray-400" />,
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
          <Input
            placeholder="Rechercher un rapport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de rapport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="activite">Activité</SelectItem>
            <SelectItem value="financier">Financier</SelectItem>
            <SelectItem value="temps">Temps</SelectItem>
            <SelectItem value="clients">Clients</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRapports.length > 0 ? (
          filteredRapports.map((rapport) => (
            <div
              key={rapport.id}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-start gap-4">
                  {rapport.icon}
                  <div>
                    <h3 className="font-semibold text-lg">{rapport.titre}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rapport.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {rapport.date} • {rapport.taille}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReport(rapport)}
                  className="hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-2 text-[#3C6255]" />
                  Générer
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">Aucun rapport ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

function generateActivityReport() {
  const activityData = [
    { activite: "Conseil fiscal", nombre: 24, pourcentage: "32%", evolution: "+5%" },
    { activite: "Comptabilité", nombre: 18, pourcentage: "24%", evolution: "+2%" },
    { activite: "Déclarations fiscales", nombre: 15, pourcentage: "20%", evolution: "+8%" },
    { activite: "Gestion de paie", nombre: 12, pourcentage: "16%", evolution: "-3%" },
    { activite: "Audit", nombre: 6, pourcentage: "8%", evolution: "+1%" }
  ];
  
  exportToPdf(
    "Rapport d'activité mensuel",
    activityData,
    `rapport-activite-${new Date().toISOString().slice(0, 7)}`
  );
}

function generateFinancialReport() {
  const financialData = [
    { categorie: "Revenus services fiscaux", montant: 2450000, evolution: "+15%", contribution: "38%" },
    { categorie: "Revenus comptabilité", montant: 1890000, evolution: "+8%", contribution: "29%" },
    { categorie: "Revenus conseils", montant: 1240000, evolution: "+12%", contribution: "19%" },
    { categorie: "Revenus formations", montant: 780000, evolution: "+20%", contribution: "12%" },
    { categorie: "Autres revenus", montant: 130000, evolution: "-5%", contribution: "2%" }
  ];
  
  exportToPdf(
    "Bilan financier trimestriel",
    financialData,
    `rapport-financier-T${Math.floor((new Date().getMonth() + 3) / 3)}-${new Date().getFullYear()}`
  );
}

function generateTimeReport() {
  const timeData = [
    { projet: "Audit LMN Corp", heures: 78, collaborateurs: 4, progression: "65%" },
    { projet: "Fiscalité ABC SA", heures: 42, collaborateurs: 2, progression: "90%" },
    { projet: "Comptabilité XYZ", heures: 112, collaborateurs: 3, progression: "45%" },
    { projet: "Restructuration DEF", heures: 56, collaborateurs: 5, progression: "30%" },
    { projet: "Formation PQR", heures: 24, collaborateurs: 1, progression: "100%" }
  ];
  
  exportToPdf(
    "Analyse des temps par projet",
    timeData,
    `rapport-temps-${new Date().toISOString().slice(0, 7)}`
  );
}

function generateClientReport() {
  const clientData = [
    { client: "ABC Cameroun SA", secteur: "Industrie", chiffre_affaires: 4250000, statut: "Actif" },
    { client: "XYZ Consulting", secteur: "Services", chiffre_affaires: 2830000, statut: "Actif" },
    { client: "LMN Technologies", secteur: "IT", chiffre_affaires: 1950000, statut: "En pause" },
    { client: "PQR Distributions", secteur: "Commerce", chiffre_affaires: 3120000, statut: "Actif" },
    { client: "DEF Constructions", secteur: "BTP", chiffre_affaires: 5340000, statut: "Actif" }
  ];
  
  try {
    const docService = new DocumentService('rapport', 'Rapport clients', 'client-analysis');
    const doc = docService.getDocument();
    
    docService.addStandardHeader();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Analyse du portefeuille clients", 15, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      "Ce rapport présente une analyse détaillée du portefeuille clients et de leurs activités. " +
      "Il comprend des informations sur le chiffre d'affaires, le secteur d'activité et le statut de chaque client.",
      15, 75
    );
    
    autoTable(doc, {
      startY: 85,
      head: [["Client", "Secteur d'activité", "Chiffre d'affaires", "Statut"]],
      body: clientData.map(client => [
        client.client,
        client.secteur,
        `${new Intl.NumberFormat('fr-FR').format(client.chiffre_affaires)} XAF`,
        client.statut
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [60, 98, 85], 
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Résumé du portefeuille", 15, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const clientCount = clientData.length;
    const activeCount = clientData.filter(c => c.statut === "Actif").length;
    const totalRevenue = clientData.reduce((sum, c) => sum + c.chiffre_affaires, 0);
    const averageRevenue = totalRevenue / clientCount;
    
    doc.text(`• Nombre total de clients: ${clientCount}`, 15, finalY + 10);
    doc.text(`• Clients actifs: ${activeCount} (${Math.round(activeCount/clientCount*100)}%)`, 15, finalY + 20);
    doc.text(`• Chiffre d'affaires total: ${new Intl.NumberFormat('fr-FR').format(totalRevenue)} XAF`, 15, finalY + 30);
    doc.text(`• Chiffre d'affaires moyen: ${new Intl.NumberFormat('fr-FR').format(Math.round(averageRevenue))} XAF`, 15, finalY + 40);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Répartition par secteur d'activité", 15, finalY + 60);
    
    docService.addStandardFooter();
    
    docService.generate(true);
  } catch (error) {
    console.error("Erreur lors de la génération du rapport clients:", error);
    throw error;
  }
}

export default Rapports;
