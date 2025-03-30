import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Client } from "@/types/client";
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { FactureColumn } from "./invoice-table/FactureColumn";
import { PaiementColumn } from "./payment-table/PaiementColumn";
import { useFactureActions } from "@/hooks/facturation/factureActions";
import { usePaiementActions } from "@/hooks/facturation/paiementActions";
import FactureCreateDialog from "../../factures/dialog/FactureCreateDialog";
import PaiementCreateDialog from "../../paiements/dialog/PaiementCreateDialog";
import FactureUpdateDialog from "../../factures/dialog/FactureUpdateDialog";
import PaiementUpdateDialog from "../../paiements/dialog/PaiementUpdateDialog";
import InvoicePreviewDialog from "../../situationClients/dialogs/InvoicePreviewDialog";
import PaymentReceiptDialog from "../../paiements/dialog/PaymentReceiptDialog";
import ClientUpdateDialog from "./ClientUpdateDialog";

interface ClientDetailsTabsProps {
  client: Client;
  factures: Facture[];
  paiements: Paiement[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ClientDetailsTabs = ({ client, factures, paiements }: ClientDetailsTabsProps) => {
  const [isFactureCreateDialogOpen, setIsFactureCreateDialogOpen] = useState(false);
  const [isPaiementCreateDialogOpen, setIsPaiementCreateDialogOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [isFactureEditDialogOpen, setIsFactureEditDialogOpen] = useState(false);
  const [isPaiementEditDialogOpen, setIsPaiementEditDialogOpen] = useState(false);
  const [isInvoicePreviewDialogOpen, setIsInvoicePreviewDialogOpen] = useState(false);
  const [isPaymentReceiptDialogOpen, setIsPaymentReceiptDialogOpen] = useState(false);
  const [isClientEditDialogOpen, setIsClientEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { deleteFacture } = useFactureActions();
  const { deletePaiement } = usePaiementActions();

  // Handlers for opening dialogs
  const handleOpenFactureCreateDialog = () => setIsFactureCreateDialogOpen(true);
  const handleOpenPaiementCreateDialog = () => setIsPaiementCreateDialogOpen(true);
  const handleOpenClientEditDialogOpen = () => setIsClientEditDialogOpen(true);

  // Handlers for closing dialogs
  const handleCloseFactureCreateDialog = () => setIsFactureCreateDialogOpen(false);
  const handleClosePaiementCreateDialog = () => setIsPaiementCreateDialogOpen(false);
  const handleCloseClientEditDialogOpen = () => setIsClientEditDialogOpen(false);

  // Invoice actions
  const handleEditFacture = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsFactureEditDialogOpen(true);
  };

  const handleCloseFactureEditDialog = () => {
    setIsFactureEditDialogOpen(false);
    setSelectedFacture(null);
  };

  const handleVoirFacture = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsInvoicePreviewDialogOpen(true);
  };

  const handleCloseInvoicePreviewDialog = () => {
    setIsInvoicePreviewDialogOpen(false);
    setSelectedFacture(null);
  };

  const handleDeleteFacture = async (facture: Facture) => {
    try {
      await deleteFacture(facture.id);
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la facture. Veuillez réessayer.",
      });
    }
  };

  // Payment actions
  const handleEditPaiement = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setIsPaiementEditDialogOpen(true);
  };

  const handleClosePaiementEditDialog = () => {
    setIsPaiementEditDialogOpen(false);
    setSelectedPaiement(null);
  };

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

  const factureColumns = [
    {
      accessorKey: "id",
      header: "N° Facture",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "echeance",
      header: "Échéance",
    },
    {
      accessorKey: "montant",
      header: "Montant",
    },
    {
      accessorKey: "status_paiement",
      header: "Statut",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const facture = row.original;
        return (
          <div className="relative flex justify-end items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVoirFacture(facture)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditFacture(facture)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteFacture(facture)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ] satisfies FactureColumn[];

  const paiementColumns = [
    {
      accessorKey: "id",
      header: "N° Paiement",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "montant",
      header: "Montant",
    },
    {
      accessorKey: "mode",
      header: "Mode",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const paiement = row.original;
        return (
          <div className="relative flex justify-end items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVoirRecu(paiement)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditPaiement(paiement)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeletePaiement(paiement)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ] satisfies PaiementColumn[];

  return (
    <div className="w-full">
      <Tab.Group>
        <div className="border-b border-gray-200">
          <Tab.List className="flex space-x-4">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  "rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                )
              }
            >
              Informations
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  "rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                )
              }
            >
              Factures{" "}
              <Badge variant="secondary" className="ml-2">
                {factures.length}
              </Badge>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  "rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                )
              }
            >
              Paiements{" "}
              <Badge variant="secondary" className="ml-2">
                {paiements.length}
              </Badge>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="focus:outline-none">
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
                    {client.type === "entreprise" && (
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
                        {client.adresse}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Contact
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {client.contact}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div>
                <Button
                  onClick={handleOpenClientEditDialogOpen}
                  className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier les informations
                </Button>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleOpenFactureCreateDialog}
                  className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une facture
                </Button>
              </div>
              <DataTable columns={factureColumns} data={factures} />
            </div>
          </Tab.Panel>
          <Tab.Panel className="focus:outline-none">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleOpenPaiementCreateDialog}
                  className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un paiement
                </Button>
              </div>
              <DataTable columns={paiementColumns} data={paiements} />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Dialogs */}
      <FactureCreateDialog
        open={isFactureCreateDialogOpen}
        onOpenChange={handleCloseFactureCreateDialog}
        clientId={client.id}
      />
      <PaiementCreateDialog
        open={isPaiementCreateDialogOpen}
        onOpenChange={handleClosePaiementCreateDialog}
        clientId={client.id}
      />
      <ClientUpdateDialog
        open={isClientEditDialogOpen}
        onOpenChange={handleCloseClientEditDialogOpen}
        client={client}
      />
      {selectedFacture && (
        <FactureUpdateDialog
          open={isFactureEditDialogOpen}
          onOpenChange={handleCloseFactureEditDialog}
          facture={selectedFacture}
        />
      )}
      {selectedPaiement && (
        <PaiementUpdateDialog
          open={isPaiementEditDialogOpen}
          onOpenChange={handleClosePaiementEditDialog}
          paiement={selectedPaiement}
        />
      )}
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
