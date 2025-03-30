
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/types/client";
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";
import { usePaiementActions } from "@/hooks/facturation/paiementActions";
import InvoicePreviewDialog from "../../situationClients/dialogs/InvoicePreviewDialog";
import PaymentReceiptDialog from "../../paiements/dialog/PaymentReceiptDialog";

interface ClientDetailsTabsProps {
  client: Client;
  factures: Facture[];
  paiements: Paiement[];
}

const ClientDetailsTabs = ({ client, factures, paiements }: ClientDetailsTabsProps) => {
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [isInvoicePreviewDialogOpen, setIsInvoicePreviewDialogOpen] = useState(false);
  const [isPaymentReceiptDialogOpen, setIsPaymentReceiptDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleVoirFacture } = useFactureViewActions();
  const { deletePaiement } = usePaiementActions();

  // Handlers for invoice preview
  const handleVoirFactureClick = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsInvoicePreviewDialogOpen(true);
  };

  const handleCloseInvoicePreviewDialog = () => {
    setIsInvoicePreviewDialogOpen(false);
    setSelectedFacture(null);
  };

  // Handlers for payment receipt
  const handleVoirRecu = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setIsPaymentReceiptDialogOpen(true);
  };

  const handleClosePaymentReceiptDialog = () => {
    setIsPaymentReceiptDialogOpen(false);
    setSelectedPaiement(null);
  };

  const handleDeletePaiement = async (paiement: Paiement) => {
    try {
      await deletePaiement(paiement.id);
      toast({
        title: "Paiement supprimé",
        description: "Le paiement a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le paiement. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="informations" className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="flex space-x-4">
            <TabsTrigger value="informations"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Informations
            </TabsTrigger>
            <TabsTrigger value="factures"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Factures{" "}
              <Badge variant="secondary" className="ml-2">
                {factures.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="paiements"
              className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Paiements{" "}
              <Badge variant="secondary" className="ml-2">
                {paiements.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="informations" className="mt-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Informations générales
                </h3>
                <dl className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {client.nom}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
                      {client.type}
                    </dd>
                  </div>
                  {client.type === "morale" && client.raisonsociale && (
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Raison Sociale
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {client.raisonsociale}
                      </dd>
                    </div>
                  )}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Numéro d'identification (NIU)
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {client.niu}
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Adresse
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {client.adresse && 
                        `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}, ${client.adresse.lieuDit || ''}`
                      }
                    </dd>
                  </div>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Contact
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {client.contact && 
                        `${client.contact.telephone || ''} ${client.contact.email ? '| ' + client.contact.email : ''}`
                      }
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div>
              <Button
                className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier les informations
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="factures" className="mt-2">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une facture
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factures.length === 0 ? (
                  <TableRow>
                    <TableHead colSpan={6} className="text-center py-6">
                      Aucune facture trouvée
                    </TableHead>
                  </TableRow>
                ) : (
                  factures.map((facture) => (
                    <TableRow key={facture.id}>
                      <TableHead>{facture.id}</TableHead>
                      <TableHead>{facture.date}</TableHead>
                      <TableHead>{facture.echeance}</TableHead>
                      <TableHead>{facture.montant}</TableHead>
                      <TableHead>{facture.status_paiement}</TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVoirFactureClick(facture)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="paiements" className="mt-2">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un paiement
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Paiement</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiements.length === 0 ? (
                  <TableRow>
                    <TableHead colSpan={5} className="text-center py-6">
                      Aucun paiement trouvé
                    </TableHead>
                  </TableRow>
                ) : (
                  paiements.map((paiement) => (
                    <TableRow key={paiement.id}>
                      <TableHead>{paiement.id}</TableHead>
                      <TableHead>{paiement.date}</TableHead>
                      <TableHead>{paiement.montant}</TableHead>
                      <TableHead>{paiement.mode}</TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVoirRecu(paiement)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedFacture && (
        <InvoicePreviewDialog
          open={isInvoicePreviewDialogOpen}
          onOpenChange={handleCloseInvoicePreviewDialog}
          invoice={selectedFacture}
        />
      )}
      {selectedPaiement && (
        <PaymentReceiptDialog
          open={isPaymentReceiptDialogOpen}
          onOpenChange={handleClosePaymentReceiptDialog}
          paiement={selectedPaiement}
        />
      )}
    </div>
  );
};

export default ClientDetailsTabs;
