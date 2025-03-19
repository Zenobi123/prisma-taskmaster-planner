
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Wallet, 
  Search, 
  Eye, 
  Edit, 
  Trash,
  CreditCard,
  Building,
  Banknote
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Facture, Paiement } from "@/types/facture";
import { getFactures, deletePaiement } from "@/services/factureService";
import { PaiementDetails } from "./PaiementDetails";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const Paiements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Récupération des factures et de leurs paiements
  const { data: factures = [], isLoading } = useQuery({
    queryKey: ["factures"],
    queryFn: getFactures,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Extraction de tous les paiements
  const tousLesPaiements: (Paiement & { facture: Facture })[] = factures.flatMap(facture => 
    (facture.paiements || []).map(paiement => ({
      ...paiement,
      facture
    }))
  );
  
  // Filtrage des paiements
  const filteredPaiements = tousLesPaiements.filter(paiement => 
    paiement.facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.facture.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.mode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mutation pour supprimer un paiement
  const deleteMutation = useMutation({
    mutationFn: deletePaiement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Paiement supprimé",
        description: "Le paiement a été supprimé avec succès."
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du paiement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du paiement.",
        variant: "destructive"
      });
    }
  });
  
  // Fonction pour afficher les détails d'un paiement
  const handleViewDetails = (paiement: Paiement & { facture: Facture }) => {
    setSelectedPaiement(paiement);
    setSelectedFacture(paiement.facture);
    setIsDetailsDialogOpen(true);
  };
  
  // Fonction pour supprimer un paiement
  const handleDelete = async (paiement: Paiement) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      try {
        await deleteMutation.mutateAsync(paiement.id);
      } catch (error) {
        console.error("Erreur lors de la suppression du paiement:", error);
      }
    }
  };
  
  // Fonction pour obtenir l'icône du mode de paiement
  const getModePaiementIcon = (mode: string) => {
    switch (mode) {
      case "virement":
        return <Building className="h-4 w-4 mr-1" />;
      case "espèces":
        return <Banknote className="h-4 w-4 mr-1" />;
      case "chèque":
        return <CreditCard className="h-4 w-4 mr-1" />;
      case "mobile":
        return <Wallet className="h-4 w-4 mr-1" />;
      case "carte":
        return <CreditCard className="h-4 w-4 mr-1" />;
      default:
        return <Wallet className="h-4 w-4 mr-1" />;
    }
  };

  // Fonction pour formater les montants
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5" /> 
            Chargement des paiements...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5" /> 
            Gestion des paiements
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaiements.length > 0 ? (
                filteredPaiements.map((paiement) => (
                  <TableRow key={paiement.id}>
                    <TableCell className="font-medium">{paiement.id.substring(0, 8)}</TableCell>
                    <TableCell>{paiement.facture.id.substring(0, 8)}</TableCell>
                    <TableCell>{paiement.facture.client.nom}</TableCell>
                    <TableCell>{formatDate(paiement.date)}</TableCell>
                    <TableCell>{formatMontant(paiement.montant)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getModePaiementIcon(paiement.mode)}
                        <span className="capitalize">{paiement.mode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleViewDetails(paiement)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(paiement)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? "Aucun paiement trouvé" : "Aucun paiement enregistré"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Boîte de dialogue pour afficher les détails d'un paiement */}
      {selectedPaiement && selectedFacture && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du paiement</DialogTitle>
            </DialogHeader>
            <PaiementDetails paiement={selectedPaiement} facture={selectedFacture} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Paiements;
