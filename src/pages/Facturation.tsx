
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { Facture } from "@/types/facture";
import { facturesMockData, filterFactures, formatMontant } from "@/data/factureData";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText, Wallet, Users } from "lucide-react";
import { GestionPaiements } from "@/components/facturation/sections/GestionPaiements";
import { SituationClients } from "@/components/facturation/sections/SituationClients";

const Facturation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("factures");
  const [factures, setFactures] = useState<Facture[]>(facturesMockData);
  const { toast } = useToast();
  
  const { hasPermission, isLoading } = useFacturationPermissions();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const filteredFactures = filterFactures(
    factures,
    searchTerm,
    statusFilter,
    periodFilter
  );

  const handleViewDetails = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowDetails(true);
  };

  const handlePrintInvoice = (factureId: string) => {
    toast({
      title: "Impression lancée",
      description: `Impression de la facture ${factureId} en cours...`,
    });
    // Logique d'impression à implémenter
  };

  const handleDownloadInvoice = (factureId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${factureId}...`,
    });
    // Logique de téléchargement à implémenter
  };

  const handleCreateInvoice = (formData: any) => {
    // Créer un nouvel ID de facture basé sur le nombre de factures existantes
    const newFactureId = `F2024-${(factures.length + 1).toString().padStart(3, '0')}`;
    
    // Map des noms de clients par ID (normalement ce serait récupéré depuis l'API)
    const clientNames: Record<string, string> = {
      "1": "SARL TechPro",
      "2": "SAS WebDev",
      "3": "EURL ConseilPlus"
    };
    
    // Créer un objet facture à partir des données du formulaire
    const newFacture: Facture = {
      id: newFactureId,
      client: {
        id: formData.clientId,
        nom: clientNames[formData.clientId] || "Nouveau Client",
        adresse: "Adresse du client",
        telephone: "Téléphone du client",
        email: "email@client.com"
      },
      date: formData.dateEmission,
      echeance: formData.dateEcheance,
      montant: formData.prestations.reduce((sum: number, p: any) => sum + p.montant, 0),
      status: "en_attente",
      prestations: formData.prestations,
      notes: formData.notes
    };
    
    // Ajouter la nouvelle facture à la liste et forcer la mise à jour de l'UI
    const updatedFactures = [...factures, newFacture];
    setFactures(updatedFactures);
    
    console.log("Nouvelle facture créée:", newFacture);
    console.log("Liste des factures mise à jour:", updatedFactures);
    console.log("Nombre de factures:", updatedFactures.length);
    
    toast({
      title: "Facture créée",
      description: "La nouvelle facture a été créée avec succès.",
    });
    setIsNewFactureDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <FacturationHeader onNewFactureClick={() => setIsNewFactureDialogOpen(true)} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex border-b mb-6 overflow-x-auto">
          <div 
            onClick={() => setActiveTab("factures")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "factures" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Gestion des factures</span>
            <span className="sm:hidden">Factures</span>
          </div>
          <div 
            onClick={() => setActiveTab("paiements")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "paiements" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Gestion des paiements</span>
            <span className="sm:hidden">Paiements</span>
          </div>
          <div 
            onClick={() => setActiveTab("clients")} 
            className={`flex gap-2 items-center py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "clients" 
                ? "text-primary border-b-2 border-primary font-medium bg-primary/5" 
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Situation Clients</span>
            <span className="sm:hidden">Clients</span>
          </div>
        </div>
        
        <TabsContent value="factures" className="animate-fade-in">
          <FacturationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
          />

          <FactureTable
            factures={filteredFactures}
            formatMontant={formatMontant}
            onViewDetails={handleViewDetails}
            onPrintInvoice={handlePrintInvoice}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </TabsContent>
        
        <TabsContent value="paiements" className="animate-fade-in">
          <GestionPaiements />
        </TabsContent>
        
        <TabsContent value="clients" className="animate-fade-in">
          <SituationClients />
        </TabsContent>
      </Tabs>

      <FactureDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onPrintInvoice={handlePrintInvoice}
        onDownloadInvoice={handleDownloadInvoice}
      />

      <NewFactureDialog
        isOpen={isNewFactureDialogOpen}
        onOpenChange={setIsNewFactureDialogOpen}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};

export default Facturation;
