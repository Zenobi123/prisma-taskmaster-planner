
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FacturationHeader } from "@/components/facturation/FacturationHeader";
import { FacturationFilters } from "@/components/facturation/FacturationFilters";
import { FactureTable } from "@/components/facturation/FactureTable";
import { FactureDetailsDialog } from "@/components/facturation/FactureDetailsDialog";
import { NewFactureDialog } from "@/components/facturation/NewFactureDialog";
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { Facture } from "@/types/facture";
import { filterFactures, formatMontant } from "@/data/factureData";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText, Wallet, Users } from "lucide-react";
import { GestionPaiements } from "@/components/facturation/sections/GestionPaiements";
import { SituationClients } from "@/components/facturation/sections/SituationClients";
import { supabase } from "@/integrations/supabase/client";

const Facturation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("factures");
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { hasPermission, isLoading: permissionsLoading } = useFacturationPermissions();

  // Fetch factures from Supabase
  useEffect(() => {
    const fetchFactures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('factures')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Map the database data to our Facture interface
        const mappedFactures: Facture[] = data.map((row: any) => ({
          id: row.id,
          client: {
            id: row.client_id,
            nom: row.client_nom,
            adresse: row.client_adresse,
            telephone: row.client_telephone,
            email: row.client_email
          },
          date: row.date,
          echeance: row.echeance,
          montant: Number(row.montant),
          status: row.status,
          prestations: Array.isArray(row.prestations) 
            ? row.prestations 
            : JSON.parse(row.prestations),
          notes: row.notes
        }));
        
        setFactures(mappedFactures);
        console.log("Factures chargées:", mappedFactures);
      } catch (error) {
        console.error("Erreur lors du chargement des factures:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les factures.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactures();
  }, [toast]);

  if (permissionsLoading || isLoading) {
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

  const handleCreateInvoice = async (formData: any) => {
    try {
      // Générer un nouvel ID de facture
      const newId = `F${new Date().getFullYear()}-${(factures.length + 1).toString().padStart(3, '0')}`;
      
      // Récupérer les informations du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', formData.clientId)
        .single();
        
      if (clientError) {
        throw new Error("Client non trouvé");
      }
      
      // Calculer le montant total
      const montantTotal = formData.prestations.reduce((sum: number, p: any) => sum + p.montant, 0);
      
      // Créer l'objet facture pour l'insertion
      const newFacture = {
        id: newId,
        client_id: formData.clientId,
        client_nom: clientData.raisonsociale || clientData.nom || "Client sans nom",
        client_adresse: clientData.adresse?.ville || "Adresse non spécifiée",
        client_telephone: clientData.contact?.telephone || "Téléphone non spécifié",
        client_email: clientData.contact?.email || "Email non spécifié",
        date: formData.dateEmission,
        echeance: formData.dateEcheance,
        montant: montantTotal,
        status: 'en_attente',
        prestations: JSON.stringify(formData.prestations),
        notes: formData.notes
      };
      
      // Insérer dans la base de données
      const { error: insertError } = await supabase
        .from('factures')
        .insert(newFacture);
        
      if (insertError) {
        throw insertError;
      }
      
      // Créer l'objet facture pour le state local
      const newFactureForState: Facture = {
        id: newId,
        client: {
          id: formData.clientId,
          nom: clientData.raisonsociale || clientData.nom || "Client sans nom",
          adresse: clientData.adresse?.ville || "Adresse non spécifiée",
          telephone: clientData.contact?.telephone || "Téléphone non spécifié",
          email: clientData.contact?.email || "Email non spécifié"
        },
        date: formData.dateEmission,
        echeance: formData.dateEcheance,
        montant: montantTotal,
        status: 'en_attente',
        prestations: formData.prestations,
        notes: formData.notes
      };
      
      // Mettre à jour l'état local
      setFactures([...factures, newFactureForState]);
      
      toast({
        title: "Facture créée",
        description: "La nouvelle facture a été créée avec succès.",
      });
      
      setIsNewFactureDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => {
    try {
      // Mettre à jour le statut dans la base de données
      const { error } = await supabase
        .from('factures')
        .update({ status: newStatus })
        .eq('id', factureId);
        
      if (error) {
        throw error;
      }
      
      // Mettre à jour l'état local
      const updatedFactures = factures.map(facture => 
        facture.id === factureId 
          ? { ...facture, status: newStatus } 
          : facture
      );
      
      setFactures(updatedFactures);
      
      if (selectedFacture && selectedFacture.id === factureId) {
        setSelectedFacture({ ...selectedFacture, status: newStatus });
      }
      
      toast({
        title: "Statut mis à jour",
        description: `La facture ${factureId} est maintenant ${newStatus.replace('_', ' ')}.`
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
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
            onUpdateStatus={handleUpdateStatus}
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
        onUpdateStatus={handleUpdateStatus}
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
