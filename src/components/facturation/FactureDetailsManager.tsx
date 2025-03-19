
import { useState } from "react";
import { Facture } from "@/types/facture";
import { useToast } from "@/components/ui/use-toast";
import { FactureDetailsDialog } from "./FactureDetailsDialog";

interface FactureDetailsManagerProps {
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  formatMontant: (montant: number) => string;
  isAdmin?: boolean;
}

export const FactureDetailsManager = ({
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
  formatMontant,
  isAdmin = false
}: FactureDetailsManagerProps) => {
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowDetails(true);
  };

  return {
    selectedFacture,
    setSelectedFacture,
    showDetails,
    setShowDetails,
    handleViewDetails,
    detailsDialog: (
      <FactureDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onPrintInvoice={onPrintInvoice}
        onDownloadInvoice={onDownloadInvoice}
        onUpdateStatus={onUpdateStatus}
        onEditInvoice={onEditInvoice}
        onDeleteInvoice={onDeleteInvoice}
        isAdmin={isAdmin}
      />
    )
  };
};
